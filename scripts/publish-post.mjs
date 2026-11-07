#!/usr/bin/env node
// Publish (or update) one markdown post into EmDash.
//
// Keeps the "write a post as a markdown file" workflow after the move to
// EmDash: the file is converted with the same converter the migration used
// (scripts/lib/post-markdown.mjs), then created or updated through the EmDash
// API, tags included. The slug is the file name, same as before.
//
// Usage:
//   npm run post:publish -- src/content/posts/my-post.md
//   npm run post:publish -- src/content/posts/my-post.md --url https://chat.dailyai.studio
//
// Auth: against localhost (npm run dev) no token is needed. Against the live
// site, set EMDASH_TOKEN to an API token created in the EmDash admin
// (Settings > API tokens) - never commit it.
//
// `draft: true` in the frontmatter keeps the post as a draft. Images still go
// in public/images/<slug>/ and are referenced as /images/<slug>/... (they ship
// with the next deploy), or use a full https:// URL.
import { EmDashClient } from 'emdash/client';
import { readPost } from './lib/post-markdown.mjs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const urlFlag = args.indexOf('--url');
const baseUrl = (urlFlag >= 0 ? args[urlFlag + 1] : process.env.EMDASH_URL) || 'http://localhost:4321';
if (!file) {
  console.error('Usage: npm run post:publish -- <path/to/post.md> [--url https://chat.dailyai.studio]');
  process.exit(1);
}

const token = process.env.EMDASH_TOKEN;
const isLocal = /localhost|127\.0\.0\.1/.test(baseUrl);
if (!token && !isLocal) {
  console.error('Set EMDASH_TOKEN (an API token from the EmDash admin) to publish to a remote site.');
  process.exit(1);
}

const client = new EmDashClient({ baseUrl, token, devBypass: !token && isLocal });
const post = readPost(file);
const publish = post.status === 'published';

// 1. Make sure every tag exists as a term in the `tag` taxonomy.
const { items: terms } = await client.terms('tag', { limit: 1000, includeCounts: false });
const termIds = [];
for (const tag of post.tags) {
  let term = terms.find((t) => t.slug === tag);
  if (!term) {
    term = await client.createTerm('tag', { slug: tag, label: tag });
    term = term.term ?? term;
    console.log(`created tag "${tag}"`);
  }
  termIds.push(term.id);
}

// 2. Create the entry, or update it if the slug already exists.
let existing;
try {
  existing = await client.get('posts', post.slug, { raw: true });
} catch (e) {
  if (!/not.?found|404/i.test(String(e?.message ?? e))) throw e;
}

let item;
if (existing) {
  item = await client.update('posts', existing.id, { data: post.data, _rev: existing._rev });
  console.log(`updated ${post.slug}`);
} else {
  item = await client.create('posts', {
    data: post.data,
    slug: post.slug,
    publishedAt: post.data.date,
  });
  console.log(`created ${post.slug}`);
}

// 3. Tags (replaces whatever the entry had).
await client['request']('POST', `/content/posts/${encodeURIComponent(item.id)}/terms/tag`, { termIds });

// 4. Publish (or leave as a draft).
if (publish) {
  await client.publish('posts', item.id);
  console.log(`published: ${baseUrl.replace(/\/$/, '')}/posts/${post.slug}`);
} else {
  console.log('left as draft (draft: true in frontmatter) - preview it from the EmDash admin');
}
