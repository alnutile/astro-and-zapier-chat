import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import tailwindcss from '@tailwindcss/vite';
import { d1, r2 } from '@emdash-cms/cloudflare';
import emdash from 'emdash/astro';

// https://astro.build/config
//
// The site runs on Cloudflare Workers with EmDash as the CMS. Posts live in D1
// (binding DB), uploaded media in R2 (binding MEDIA). Pages render on request,
// so a post published in the EmDash admin (/_emdash/admin) is live immediately
// with no rebuild. Static files in public/ (fonts, /images/...) are served as
// Workers static assets, so existing image URLs keep working.
//
// Public pages are cached in the Workers Cache. EmDash purges the `posts` tag
// whenever a post is published/unpublished/edited live, so changes show up
// within seconds; maxAge only bounds staleness if a purge fails (Workers
// Cache purges are rate-limited to 5/min). Invalidate the `all` tag to clear
// everything at once.
const POSTS = { maxAge: 3600, swr: 86400, tags: ['posts', 'all'] };

export default defineConfig({
  output: 'server',
  site: 'https://chat.dailyai.studio',
  adapter: cloudflare({
    // Covers in public/ and remote covers are served as-is (same as before:
    // the old build never ran them through astro:assets either).
    imageService: 'passthrough',
  }),
  cache: {
    provider: cacheCloudflare(),
  },
  routeRules: {
    '/': POSTS,
    '/journal': POSTS,
    '/journal.md': POSTS,
    '/faq': POSTS,
    '/about': POSTS,
    '/about.md': POSTS,
    '/styleguide': POSTS,
    '/posts/[slug]': POSTS,
    '/posts/[slug].md': POSTS,
    '/tags/[tag]': POSTS,
    '/rss.xml': POSTS,
    '/llms.txt': POSTS,
    '/llms-full.txt': POSTS,
    '/sitemap-index.xml': POSTS,
    '/sitemap-0.xml': POSTS,
  },
  vite: {
    // Using Tailwind CSS v4 with @tailwindcss/vite
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    react(),
    emdash({
      database: d1({ binding: 'DB', session: 'auto', coalesce: true }),
      storage: r2({ binding: 'MEDIA' }),
      // Cached pages are shared with logged-in editors; the client toolbar
      // still shows the edit pill on them (see EmDash route-caching docs).
      toolbar: 'client',
    }),
  ],
  devToolbar: { enabled: false },
});
