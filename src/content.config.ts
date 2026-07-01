import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    // Set `draft: true` to keep a post out of the production build (site pages,
    // RSS, tag pages, llms.txt, and the chatbot index). Drafts still render in
    // `npm run dev` so you can preview them. See src/lib/posts.ts.
    draft: z.boolean().default(false),
    // Optional Q&A for tutorial/explainer posts. When present, the post renders
    // a visible FAQ section AND matching FAQPage JSON-LD (for AI answer engines
    // and "how do I…" results). Keep questions/answers as plain prose so the
    // structured data matches the visible text.
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
