import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../../lib/posts';

// /posts/<slug>.md — the clean-markdown twin of every /posts/<slug> page.
//
// This is the per-page half of the site's LLM story: /llms.txt maps the whole
// site and /llms-full.txt dumps everything, while this endpoint lets an agent
// fetch one post as source markdown (no nav chrome, no HTML) at the same slug
// with a `.md` suffix. Post pages advertise it via <link rel="alternate"
// type="text/markdown"> in the <head> (see BaseLayout/PostLayout).
//
// Static site (`output: 'static'`), so there is no request-time content
// negotiation — the `.md` sibling + the rel=alternate link are the discovery
// path. The body is read straight from entry.body, so this never drifts from
// the post source.

// One static route per published post, mirroring posts/[slug].astro.
export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  return posts.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const base = (site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');
  const { entry } = props as { entry: Awaited<ReturnType<typeof getPublishedPosts>>[number] };
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
