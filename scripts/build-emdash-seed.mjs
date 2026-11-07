#!/usr/bin/env node
// Builds seed/seed.json for EmDash from the markdown posts in src/content/posts.
//
// The seed defines the `posts` collection (fields mirror the old frontmatter
// schema), the `tag` taxonomy, and - as seed content - every post converted
// from markdown to Portable Text (see scripts/lib/post-markdown.mjs). On a
// fresh EmDash database (local or D1) the setup wizard at /_emdash/admin
// imports all of it when "Sample content" is selected (the default). Slugs
// stay identical to the old file names, so every /posts/<slug> and
// /tags/<tag> URL survives the move.
//
// Usage: npm run seed:build
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { readPost } from './lib/post-markdown.mjs';

const POSTS_DIR = 'src/content/posts';
const OUT = 'seed/seed.json';

const files = readdirSync(POSTS_DIR)
  .filter((f) => ['.md', '.mdx'].includes(extname(f)))
  .sort();

const tagSet = new Set();
const posts = [];

for (const f of files) {
  const { slug, status, tags, data } = readPost(join(POSTS_DIR, f));
  tags.forEach((t) => tagSet.add(t));
  const entry = { id: `post-${slug}`, slug, status, data };
  if (tags.length) entry.taxonomies = { tag: tags };
  posts.push(entry);
}

// Newest first, matching how the site lists them.
posts.sort((a, b) => b.data.date.localeCompare(a.data.date));

const seed = {
  $schema: 'https://emdashcms.com/seed.schema.json',
  version: '1',
  meta: {
    name: 'DailyAi',
    description: 'DailyAi blog by Alfred Nutile, migrated from markdown',
    author: 'Alfred Nutile',
  },
  settings: {
    title: 'DailyAi',
    tagline: 'Blog posts about how you can start using AI today.',
  },
  collections: [
    {
      slug: 'posts',
      label: 'Posts',
      labelSingular: 'Post',
      urlPattern: '/posts/{slug}',
      supports: ['drafts', 'revisions', 'preview', 'scheduling', 'search', 'seo'],
      titleField: 'title',
      dateField: 'date',
      fields: [
        { slug: 'title', label: 'Title', type: 'string', required: true, searchable: true },
        { slug: 'date', label: 'Date', type: 'datetime', required: true, indexed: true },
        { slug: 'excerpt', label: 'Excerpt', type: 'text', required: true, searchable: true },
        {
          slug: 'image',
          label: 'Cover image URL',
          type: 'string',
        },
        { slug: 'content', label: 'Content', type: 'portableText', searchable: true },
        {
          // EmDash returns an entry's terms sorted by label; this keeps the
          // order tags were written in (first tag first). Optional.
          slug: 'tag_order',
          label: 'Tag display order (optional, comma-separated)',
          type: 'string',
        },
        {
          slug: 'faq',
          label: 'FAQ',
          type: 'repeater',
          validation: {
            subFields: [
              { slug: 'question', label: 'Question', type: 'string', required: true },
              { slug: 'answer', label: 'Answer (plain text)', type: 'text', required: true },
            ],
          },
        },
      ],
    },
  ],
  taxonomies: [
    {
      name: 'tag',
      label: 'Tags',
      labelSingular: 'Tag',
      hierarchical: false,
      collections: ['posts'],
      terms: [...tagSet].sort().map((t) => ({ slug: t, label: t })),
    },
  ],
  content: { posts },
};

mkdirSync('seed', { recursive: true });
writeFileSync(OUT, JSON.stringify(seed, null, 1) + '\n');
console.log(
  `Wrote ${OUT}: ${posts.length} posts (${posts.filter((p) => p.status === 'draft').length} drafts), ${tagSet.size} tags`,
);
