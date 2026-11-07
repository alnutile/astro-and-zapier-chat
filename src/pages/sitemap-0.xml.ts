import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../lib/posts';

// Every public page, generated from EmDash on request so new posts and tags
// show up without a rebuild. Trailing slashes match the old static sitemap.
const STATIC_PAGES = ['/', '/about/', '/faq/', '/journal/', '/styleguide/'];

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');
  const posts = await getPublishedPosts();
  const tags = [...new Set(posts.flatMap((p) => p.data.tags))].sort();

  const urls = [
    ...STATIC_PAGES,
    ...tags.map((t) => `/tags/${t}/`),
    ...posts.map((p) => `/posts/${p.id}/`),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls.map((u) => `<url><loc>${escape(base + u)}</loc></url>`).join('') +
    '</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
