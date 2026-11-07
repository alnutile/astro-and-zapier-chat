import { getEmDashCollection, getEmDashEntry } from 'emdash';
import { portableTextToMd } from './pt-markdown';

// Single source of truth for "which posts are live".
//
// Posts live in EmDash (D1 on Cloudflare). Every page/endpoint that lists posts
// goes through here so they all see the same shape. EmDash only serves
// `published` entries to anonymous visitors, so drafts are hidden everywhere at
// once (site listings, post pages, RSS, tag pages, llms.txt). Editors preview
// drafts from the EmDash admin.
//
// The returned shape deliberately mirrors the old Astro content-collection
// entry (`id` = slug, `data` = frontmatter, `body` = markdown) so the pages and
// components didn't have to change.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PostData {
  title: string;
  date: Date;
  excerpt: string;
  image?: string;
  tags: string[];
  faq?: FaqItem[];
}

export interface Post {
  /** URL slug: /posts/<id> */
  id: string;
  data: PostData;
  /** Portable Text body, for <PortableText /> */
  content: unknown[];
  /** Markdown body, for the .md twins and llms-full.txt */
  readonly body: string;
}

type EmDashEntry = { id: string; data: Record<string, any> };

function toPost(entry: EmDashEntry): Post {
  const d = entry.data;
  const content = Array.isArray(d.content) ? d.content : [];
  const tags: string[] = (d.terms?.tag ?? [])
    .map((t: { slug?: string; label?: string } | string) =>
      typeof t === 'string' ? t : t.slug ?? t.label ?? '',
    )
    .filter(Boolean);
  // Terms come back sorted by label; restore the author's order when the
  // post has one (tag_order), otherwise keep EmDash's order.
  const order: string[] = String(d.tag_order ?? '')
    .split(',')
    .map((t: string) => t.trim())
    .filter(Boolean);
  const rank = (t: string) => (order.includes(t) ? order.indexOf(t) : order.length);
  tags.sort((a, b) => rank(a) - rank(b));
  const faq: FaqItem[] | undefined = Array.isArray(d.faq)
    ? d.faq.filter((f: FaqItem) => f?.question && f?.answer)
    : undefined;

  let body: string | undefined;
  return {
    id: entry.id,
    data: {
      title: d.title ?? '',
      date: new Date(d.date ?? d.publishedAt ?? d.createdAt),
      excerpt: d.excerpt ?? '',
      image: d.image || undefined,
      tags,
      faq: faq?.length ? faq : undefined,
    },
    content,
    get body() {
      body ??= portableTextToMd(content as any[]);
      return body;
    },
  };
}

// Newest first; posts sharing a date fall back to slug order, which is how the
// old content collection ordered them (keeps prev/next links identical).
const byDateDesc = (a: Post, b: Post) =>
  b.data.date.valueOf() - a.data.date.valueOf() || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/** Every published post, newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  let cursor: string | undefined;
  do {
    const result = await getEmDashCollection('posts', {
      orderBy: { date: 'desc' },
      limit: 100,
      ...(cursor ? { cursor } : {}),
    });
    if (result.error) throw result.error;
    posts.push(...(result.entries as EmDashEntry[]).map(toPost));
    cursor = result.nextCursor;
  } while (cursor);
  return posts.sort(byDateDesc);
}

/** One published post by slug, or undefined. */
export async function getPublishedPost(slug: string): Promise<Post | undefined> {
  const { entry, error } = await getEmDashEntry('posts', slug);
  if (error) throw error;
  return entry ? toPost(entry as EmDashEntry) : undefined;
}

/** Previous (newer) and next (older) posts around `slug`, for post navigation. */
export function neighbours(posts: Post[], slug: string) {
  const i = posts.findIndex((p) => p.id === slug);
  const link = (p?: Post) => (p ? { url: `/posts/${p.id}`, title: p.data.title } : null);
  return { prevPost: link(posts[i - 1]), nextPost: link(posts[i + 1]) };
}
