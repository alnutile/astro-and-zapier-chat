import type { APIRoute } from 'astro';

// Replaces @astrojs/sitemap (which only sees prerendered pages). Same URLs as
// before: /sitemap-index.xml -> /sitemap-0.xml, referenced from robots.txt.
export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${base}/sitemap-0.xml</loc></sitemap></sitemapindex>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
