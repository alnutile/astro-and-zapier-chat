import { getCollection } from 'astro:content';

/**
 * Posts for public-facing output.
 *
 * Astro content collections do NOT filter drafts automatically (that was the old
 * file-based Markdown behavior). So a post with `draft: true` in its frontmatter
 * stays visible while developing (`npm run dev`) — you can preview it and keep
 * editing it on `main` — but is excluded from the production build, the RSS and
 * llms feeds, and the chatbot index (`/chat-index.json`).
 *
 * Every place that lists posts should call this instead of `getCollection('posts')`
 * directly, so drafts are hidden consistently everywhere in production.
 */
export async function getPublishedPosts() {
  const posts = await getCollection('posts');
  if (import.meta.env.PROD) {
    return posts.filter((post) => !post.data.draft);
  }
  return posts;
}
