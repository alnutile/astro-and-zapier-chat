import { getPublishedPosts } from '../lib/posts';

// /llms.txt — the GEO (Generative Engine Optimization) index, per llmstxt.org.
// A clean, link-rich map of the site that AI answer engines can read to
// understand and cite the content. Rebuilt on every deploy, like the RSS feed.
export async function GET(context) {
  const site = (context.site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');

  const posts = (await getPublishedPosts()).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  const lines = [
    '# DailyAi — Alfred Nutile',
    '',
    '> Practical writing on AI, no-code, and automation — how everyday people and businesses can start using AI today, for the rest of us.',
    '',
    'Written by Alfred Nutile. New posts are added regularly. The site also runs an AI assistant that answers reader questions using these posts.',
    '',
    '## Posts',
    '',
    ...posts.map((p) => {
      const date = new Date(p.data.date).toISOString().slice(0, 10);
      return `- [${p.data.title}](${site}/posts/${p.id}/) (${date}): ${p.data.excerpt}`;
    }),
    '',
    '## Pages',
    '',
    `- [About](${site}/about/): About Alfred Nutile and DailyAi`,
    `- [Journal](${site}/journal/): Every post, newest first`,
    '',
    '## Optional',
    '',
    `- [Full text of every post](${site}/llms-full.txt): all post content concatenated in one file`,
    'Every page also has a clean-markdown twin at the same path with a `.md` suffix (e.g. `/posts/<slug>.md`, `/about.md`, `/journal.md`), advertised on each page via `<link rel="alternate" type="text/markdown">`.',
    `- [RSS feed](${site}/rss.xml)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
