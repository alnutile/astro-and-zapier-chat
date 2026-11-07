// Portable Text -> Markdown for the .md twins and /llms-full.txt.
//
// EmDash ships a converter (portableTextToMarkdown) but it serializes tables
// and other non-paragraph blocks as JSON comment fences, which is noise for an
// LLM reading the page. This one covers the block types this site's posts
// use and falls back to EmDash's converter for anything else.
import { portableTextToMarkdown } from 'emdash/client';

type Span = { _type: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
type Block = Record<string, any>;

const DECORATORS: Record<string, string> = { strong: '**', em: '*', 'strike-through': '~~', strikethrough: '~~' };

function spans(children: Span[] = [], markDefs: MarkDef[] = []): string {
  const links = new Map(markDefs.filter((d) => d._type === 'link').map((d) => [d._key, d.href ?? '']));
  let out = '';
  for (const s of children) {
    if (s._type !== 'span') continue;
    const marks = s.marks ?? [];
    let text = s.text ?? '';
    if (!text) continue;
    if (marks.includes('code')) text = '`' + text + '`';
    for (const m of marks) if (DECORATORS[m]) text = DECORATORS[m] + text + DECORATORS[m];
    const link = marks.find((m) => links.has(m));
    if (link) {
      const href = links.get(link)!;
      text = text === href ? href : `[${text}](${href})`;
    }
    out += text;
  }
  return out;
}

export function portableTextToMd(blocks: Block[] = []): string {
  const parts: string[] = [];
  let prevList = false;
  const counters: number[] = [];

  for (const b of blocks) {
    const isList = b._type === 'block' && !!b.listItem;
    if (!isList) counters.length = 0;
    // Consecutive list items stay together; everything else is blank-line separated.
    const join = (s: string) => {
      parts.push((isList && prevList ? '\n' : parts.length ? '\n\n' : '') + s);
      prevList = isList;
    };

    if (b._type === 'block') {
      const text = spans(b.children, b.markDefs);
      if (b.listItem) {
        const level = Math.max(1, b.level ?? 1);
        counters.length = level;
        counters[level - 1] = (counters[level - 1] ?? 0) + 1;
        const bullet = b.listItem === 'number' ? `${counters[level - 1]}.` : '-';
        join(`${'  '.repeat(level - 1)}${bullet} ${text}`.trimEnd());
      } else if (/^h[1-6]$/.test(b.style ?? '')) {
        join(`${'#'.repeat(Number(b.style[1]))} ${text}`);
      } else if (b.style === 'blockquote') {
        join(text ? `> ${text}` : '>');
      } else if (text) {
        join(text);
      }
    } else if (b._type === 'code') {
      join('```' + (b.language ?? '') + '\n' + (b.code ?? '') + '\n```');
    } else if (b._type === 'image') {
      const url = b.asset?.url;
      if (!url) continue;
      const img = `![${b.alt ?? ''}](${url})`;
      const href = typeof b.link === 'string' ? b.link : b.link?.href;
      join(href ? `[${img}](${href})` : img);
    } else if (b._type === 'break') {
      join('---');
    } else if (b._type === 'table') {
      const rows: string[][] = (b.rows ?? []).map((r: any) =>
        (r.cells ?? []).map((c: any) => spans(c.content, c.markDefs).replace(/\|/g, '\\|')),
      );
      if (!rows.length) continue;
      const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
      const [head, ...body] = rows;
      join([line(head), line(head.map(() => '---')), ...body.map(line)].join('\n'));
    } else {
      join(portableTextToMarkdown([b] as any).trim());
    }
  }
  return parts.join('');
}
