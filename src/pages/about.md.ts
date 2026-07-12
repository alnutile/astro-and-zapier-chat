import type { APIRoute } from 'astro';

// /about.md — the markdown twin of the /about page.
//
// The About page is hand-authored HTML (about.astro), not a content-collection
// entry, so this markdown is maintained by hand alongside it. If you edit the
// prose in about.astro, mirror the change here. The /about page advertises this
// file via <link rel="alternate" type="text/markdown"> (see about.astro).
export const GET: APIRoute = () => {
  const body = `# About

> About Alfred Nutile — 20+ years in software, now focused on AI for non-developers.

20+ years in software. Now I'm focused on AI for everyone else.

Hi, I'm Alfred. I've been building software for more than 20 years — started with fixing PCs, moved into Laravel and full-stack development, and ended up at companies like Pfizer building security tooling. Pretty standard career arc, until the last couple of years.

Then AI changed the rules. And I don't mean "added a chatbot." I mean the people closest to the problem can now actually solve it themselves — without waiting on a developer ticket. That's the shift I'm spending my time on now.

## What this site is

DailyAi is where I write about what's actually working — for me, for clients, for people who've never opened a terminal. No hype. No 10x productivity claims. Just real workflows with tools like Claude, n8n, Supabase, Lovable, and a growing list of others, plus the lessons I'm picking up along the way.

If you're a small business owner, an office manager, a non-profit coordinator — anyone who has a task you're tired of doing manually — there's a good chance you can hand it off to AI right now. You don't need a CS degree. You need ten minutes and one task. That's the whole thing.

## Where else to find me

- [YouTube — @AlfredNutile](https://www.youtube.com/@AlfredNutile) — videos walking through real builds and tools
- [LinkedIn](https://www.linkedin.com/in/alfrednutile/)
- [X / Twitter — @AlfredNutile](https://x.com/AlfredNutile)

## Want to work together?

I work with teams and individuals who want to build with AI without rebuilding their whole stack. If that sounds like you, reach out on any of the links above and let's talk.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
