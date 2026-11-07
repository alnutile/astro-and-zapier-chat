import type { APIRoute } from 'astro';
import { getPublishedPost } from '../../lib/posts';

// /posts/<slug>.md — the clean-markdown twin of every /posts/<slug> page.
//
// This is the per-page half of the site's LLM story: /llms.txt maps the whole
// site and /llms-full.txt dumps everything, while this endpoint lets an agent
// fetch one post as source markdown (no nav chrome, no HTML) at the same slug
// with a `.md` suffix. Post pages advertise it via <link rel="alternate"
// type="text/markdown"> in the <head> (see BaseLayout/PostLayout).
//
// Served on request from EmDash. The body is the post's Portable Text
// converted back to markdown, so it never drifts from what the page shows.

export const GET: APIRoute = async ({ params, site }) => {
  const base = (site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');
  const entry = params.slug ? await getPublishedPost(params.slug) : undefined;
  if (!entry) return new Response('Not found', { status: 404 });
  const { title, date, excerpt, tags } = entry.data;

  const lines = [
    `# ${title}`,
    '',
    `> ${excerpt}`,
    '',
    `URL: ${base}/posts/${entry.id}/`,
    `Date: ${new Date(date).toISOString().slice(0, 10)}`,
  ];
  if (tags?.length) lines.push(`Tags: ${tags.join(', ')}`);
  lines.push('', (entry.body ?? '').trim(), '');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
