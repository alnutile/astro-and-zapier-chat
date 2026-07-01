import { getCollection, type CollectionEntry } from 'astro:content';

// Single source of truth for "which posts are live".
//
// Every page/endpoint that lists posts should go through this instead of calling
// getCollection('posts') directly, so a `draft: true` post is hidden everywhere
// at once (site listings, individual post pages, RSS, tag pages, llms.txt, and
// the chatbot knowledge index).
//
// Drafts stay visible in `npm run dev` so you can preview them locally; they are
// only hidden in the production build (`npm run build` / Railway deploy), which
// is where import.meta.env.PROD is true.
export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  return getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
}
