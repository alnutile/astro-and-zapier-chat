// Shared by scripts/build-emdash-seed.mjs (bulk import) and
// scripts/publish-post.mjs (one post at a time): turns a markdown post file
// into the EmDash `posts` entry shape.
import { readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';
import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { gfm } from 'micromark-extension-gfm';
import { retext } from 'retext';
import smartypants from 'retext-smartypants';

/**
 * Read a post file (frontmatter + markdown body) and return
 * { slug, status, tags, data } where `data` matches the EmDash posts fields.
 */
export function readPost(file) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`No frontmatter in ${file}`);
  const fm = yaml.load(match[1]) ?? {};
  const body = match[2];
  for (const k of ['title', 'date', 'excerpt']) {
    if (fm[k] == null) throw new Error(`${file}: missing required frontmatter "${k}"`);
  }
  const date = fm.date instanceof Date ? fm.date : new Date(fm.date);
  if (Number.isNaN(date.valueOf())) throw new Error(`${file}: bad date ${fm.date}`);
  const tags = (fm.tags ?? []).map(String).filter(Boolean);
  return {
    slug: basename(file, extname(file)),
    status: fm.draft === true ? 'draft' : 'published',
    tags,
    data: {
      title: String(fm.title),
      date: date.toISOString(),
      excerpt: String(fm.excerpt),
      ...(fm.image ? { image: String(fm.image) } : {}),
      ...(tags.length > 1 ? { tag_order: tags.join(', ') } : {}),
      content: toPortableText(body.trim()),
      ...(Array.isArray(fm.faq) && fm.faq.length
        ? { faq: fm.faq.map((q) => ({ question: String(q.question), answer: String(q.answer) })) }
        : {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Markdown -> Portable Text
//
// Parsed with the same remark + GFM parser the old Astro build used, so the
// structure matches what the site rendered before (autolinked bare URLs,
// tables, lists, thematic breaks, etc.). EmDash's own markdownToPortableText
// helper drops several of these, so it isn't used here.
// ---------------------------------------------------------------------------

let keySeq = 0;
const key = () => `k${(keySeq++).toString(36)}`;

// The old pipeline also ran smartypants (curly quotes, em dashes, ellipses) at
// render time. Bake the same typography into the stored text. Code is left
// alone. Spans are joined per block so quotes that open in one span and close
// in another still pair up.
const typographer = retext().use(smartypants);
const SEP = '\uE000';

function smarten(spans) {
  const isText = (sp) => sp._type === 'span' && !(sp.marks ?? []).includes('code');
  if (!spans.some(isText)) return;
  const joined = spans.map((sp) => (isText(sp) ? sp.text : '\uE001')).join(SEP);
  const out = String(typographer.processSync(joined)).split(SEP);
  if (out.length !== spans.length) return; // never corrupt on mismatch
  spans.forEach((sp, i) => {
    if (isText(sp)) sp.text = out[i];
  });
}

/** Inline mdast nodes -> { children: spans, markDefs }. */
function inline(nodes) {
  const children = [];
  const markDefs = [];
  const visit = (list, marks) => {
    for (const n of list) {
      switch (n.type) {
        case 'text':
          children.push({ _type: 'span', _key: key(), text: n.value.replace(/\n/g, ' '), marks });
          break;
        case 'inlineCode':
          children.push({ _type: 'span', _key: key(), text: n.value, marks: [...marks, 'code'] });
          break;
        case 'strong':
        case 'emphasis':
        case 'delete': {
          const deco = { strong: 'strong', emphasis: 'em', delete: 'strike-through' }[n.type];
          const outer = [...marks, deco];
          const start = children.length;
          visit(n.children, outer);
          // The renderer nests marks covering the same spans as link-first,
          // then strong, em... So `**[x](u)**` would come out <a><strong>,
          // not <strong><a> as before (and the theme colours those
          // differently). When something is nested inside this decorator, a
          // trailing empty span makes the decorator cover more spans, which
          // keeps it outermost, like the original markup.
          if (children.slice(start).some((sp) => sp.marks.length > outer.length)) {
            children.push({ _type: 'span', _key: key(), text: '', marks: outer });
          }
          break;
        }
        case 'link': {
          const k = key();
          markDefs.push({ _type: 'link', _key: k, href: n.url });
          visit(n.children, [...marks, k]);
          break;
        }
        case 'break':
          children.push({ _type: 'span', _key: key(), text: '\n', marks });
          break;
        case 'image': // only reached for images we couldn't lift out (e.g. in tables)
          children.push({ _type: 'span', _key: key(), text: n.alt ?? '', marks });
          break;
        default:
          throw new Error(`Unhandled inline node: ${n.type}`);
      }
    }
  };
  visit(nodes, []);
  if (!children.length) children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  smarten(children);
  return { children, markDefs };
}

const imageBlock = (img, href) => ({
  _type: 'image',
  _key: key(),
  alt: img.alt ?? '',
  asset: { url: img.url },
  ...(href ? { link: { href } } : {}),
});

const isLinkedImage = (n) =>
  n.type === 'link' && n.children.length > 0 &&
  n.children.every((c) => c.type === 'image' || (c.type === 'text' && !c.value.trim()));

/**
 * A paragraph -> one or more blocks. Images (and links wrapping only an
 * image) are lifted out into their own image blocks, like EmDash's editor
 * stores them.
 */
function paragraph(nodes, extra = {}) {
  const out = [];
  let run = [];
  const flush = () => {
    if (run.some((n) => n.type !== 'text' || n.value.trim())) {
      out.push({ _type: 'block', _key: key(), style: 'normal', ...extra, ...inline(run) });
    }
    run = [];
  };
  for (const n of nodes) {
    if (n.type === 'image') {
      flush();
      out.push(imageBlock(n));
    } else if (isLinkedImage(n)) {
      flush();
      for (const img of n.children.filter((c) => c.type === 'image')) out.push(imageBlock(img, n.url));
    } else {
      run.push(n);
    }
  }
  flush();
  // Pieces split out of one markdown paragraph (text + image, image +
  // caption) rendered inside a single <p> before. Flag the seams so the
  // renderer butts them together with no paragraph gap.
  for (let i = 0; i < out.length - 1; i++) {
    out[i]._joinNext = true;
    out[i + 1]._joinPrev = true;
  }
  return out;
}

function blocks(nodes, ctx = {}) {
  const out = [];
  for (const n of nodes) {
    switch (n.type) {
      case 'heading': {
        // Via paragraph() so an image in a heading (e.g. `![](x.png)` followed
        // by `---`, which is a setext h2) is lifted out instead of dropped.
        const parts = paragraph(n.children, { style: `h${n.depth}` });
        if (!parts.length) {
          // Empty heading: the old site rendered an empty <hN>; keep its spacing.
          parts.push({ _type: 'block', _key: key(), style: `h${n.depth}`, markDefs: [], children: [{ _type: 'span', _key: key(), text: '', marks: [] }] });
        } else if (parts.every((b) => b._type === 'image')) {
          // Image-only heading: rendered as <hN><img></hN> before.
          parts.forEach((b) => { b._heading = `h${n.depth}`; });
        }
        out.push(...parts);
        break;
      }
      case 'paragraph':
        out.push(...paragraph(n.children, ctx.blockquote ? { style: 'blockquote' } : {}));
        break;
      case 'blockquote':
        if (!n.children.length) {
          // Bare `>` line (a Substack import artifact). The old site rendered
          // an empty <blockquote>; keep it so the page looks the same.
          out.push({ _type: 'block', _key: key(), style: 'blockquote', _empty: true, markDefs: [], children: [{ _type: 'span', _key: key(), text: '', marks: [] }] });
        }
        {
          const quoted = blocks(n.children, { ...ctx, blockquote: true });
          // Mark where each markdown blockquote starts, so two quotes that
          // sit next to each other stay two <blockquote>s (EmDash would merge
          // consecutive quote blocks into one).
          const first = quoted.find((b) => b._type === 'block' && b.style === 'blockquote');
          if (first) first._quoteStart = true;
          out.push(...quoted);
        }
        break;
      case 'list': {
        // "Loose" lists (items separated by blank lines) rendered as
        // <li><p>...</p></li> on the old site; flag them so the renderer can
        // do the same (see src/components/portable-text/ListItem.astro).
        const loose = n.spread || n.children.some((c) => c.spread);
        for (const item of n.children) out.push(...listItem(item, n.ordered, (ctx.level ?? 0) + 1, ctx, loose));
        break;
      }
      case 'code':
        out.push({ _type: 'code', _key: key(), code: n.value, ...(n.lang ? { language: n.lang } : {}) });
        break;
      case 'thematicBreak':
        out.push({ _type: 'break', _key: key(), style: 'line' });
        break;
      case 'table':
        out.push({
          _type: 'table',
          _key: key(),
          hasHeaderRow: true,
          rows: n.children.map((row, r) => ({
            _type: 'tableRow',
            _key: key(),
            cells: row.children.map((cell, c) => {
              const { children, markDefs } = inline(cell.children);
              return {
                _type: 'tableCell',
                _key: key(),
                content: children,
                markDefs,
                isHeader: r === 0,
                ...(n.align?.[c] ? { textAlign: n.align[c] } : {}),
              };
            }),
          })),
        });
        break;
      default:
        throw new Error(`Unhandled block node: ${n.type}`);
    }
  }
  return out;
}

function listItem(item, ordered, level, ctx, loose) {
  const out = [];
  let first = true;
  if (!item.children.length) {
    // Empty item (common in the Substack imports: "- " then a blank line).
    // The old site rendered an empty bullet; keep it so posts look the same.
    out.push({ _type: 'block', _key: key(), style: 'normal', listItem: ordered ? 'number' : 'bullet', level, markDefs: [], children: [{ _type: 'span', _key: key(), text: '', marks: [] }] });
  }
  for (const child of item.children) {
    if (child.type === 'paragraph' && first) {
      const [head, ...rest] = paragraph(child.children);
      if (head?._type === 'block') {
        Object.assign(head, { listItem: ordered ? 'number' : 'bullet', level }, loose ? { _loose: true } : {});
        if (typeof item.checked === 'boolean') {
          head.children.unshift({ _type: 'span', _key: key(), text: item.checked ? '[x] ' : '[ ] ', marks: [] });
        }
        out.push(head, ...rest);
      } else if (head) {
        out.push(head, ...rest);
      }
      first = false;
    } else if (child.type === 'paragraph') {
      // A second paragraph in the same item: keep it in the list at the same level.
      for (const b of paragraph(child.children)) {
        if (b._type === 'block') Object.assign(b, { listItem: ordered ? 'number' : 'bullet', level });
        out.push(b);
      }
    } else {
      out.push(...blocks([child], { ...ctx, level }));
      first = false;
    }
  }
  return out;
}

export function toPortableText(markdown) {
  const tree = fromMarkdown(markdown, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  });
  return blocks(tree.children);
}
