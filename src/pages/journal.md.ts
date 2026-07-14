import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/posts';

// /journal.md — the markdown twin of the /journal listing page: every published
// post, newest first, as a link-rich list. Generated from the posts collection
// so it never drifts. The /journal page advertises this via <link rel="alternate"
// type="text/markdown"> (see journal.astro → BaseLayout).
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');

  const posts = (await getPublishedPosts()).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  const lines = [
    '# Journal — DailyAi',
    '',
    '> Practical writing on AI, no-code, and the workflows that actually save time. Every post, newest first, by Alfred Nutile.',
    '',
    ...posts.map((p) => {
      const date = new Date(p.data.date).toISOString().slice(0, 10);
      return `- [${p.data.title}](${base}/posts/${p.id}.md) (${date}): ${p.data.excerpt}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
