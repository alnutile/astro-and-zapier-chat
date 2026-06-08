import { getCollection } from 'astro:content';

// Build-time JSON index of every post. This is the chatbot's entire "knowledge
// base" — no vector DB / no RAG. The Cloudflare Worker fetches this file and
// stuffs it into the system prompt, so new posts flow in on each deploy with no
// Worker change. Mirrors the pattern in rss.xml.js.
export async function GET() {
  const posts = await getCollection('posts');

  const index = posts
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf())
    .map((post) => ({
      title: post.data.title,
      excerpt: post.data.excerpt,
      url: `/posts/${post.id}/`,
      date: new Date(post.data.date).toISOString().slice(0, 10),
      tags: post.data.tags,
    }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      // The Worker caches this itself; this just lets CDNs/browsers cache too.
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
