import { getCollection } from 'astro:content';

// /llms-full.txt — every post's full content in one file, newest first, as clean
// markdown. This is the "give the model everything" companion to /llms.txt, so an
// AI engine can ingest the whole site in a single fetch. Linked from the
// "Optional" section of llms.txt since it's large.
export async function GET(context) {
  const site = (context.site?.toString() ?? 'https://chat.dailyai.studio').replace(/\/$/, '');

  const posts = (await getCollection('posts')).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  const parts = [
    '# DailyAi — Full content',
    '',
    '> Every post on DailyAi in full, newest first. Practical AI, no-code, and automation by Alfred Nutile (' + site + ').',
    '',
  ];

  for (const p of posts) {
    const date = new Date(p.data.date).toISOString().slice(0, 10);
    parts.push('---', '');
    parts.push(`# ${p.data.title}`);
    parts.push(`URL: ${site}/posts/${p.id}/`);
    parts.push(`Date: ${date}`);
    if (p.data.tags?.length) parts.push(`Tags: ${p.data.tags.join(', ')}`);
    parts.push('', (p.body ?? '').trim(), '');
  }

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
