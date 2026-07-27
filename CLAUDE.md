# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the **owner's active, in-use blogging platform** at `chat.dailyai.studio` (deployed on Railway) — not a template to experiment with. There are ~158 published posts in [src/content/posts/](src/content/posts/) and new posts are added regularly. Treat changes as production-impacting: be conservative with anything that touches the frontmatter schema, post URL structure (`/posts/[slug]`, `/tags/[tag]`), or the Zapier sync contract.

Built from the Brook Astro template. It is a **static site** (`output: 'static'`) that pairs with a **self-hosted chatbot**: a popup widget ([src/components/ui/ChatWidget.astro](src/components/ui/ChatWidget.astro)) embedded sitewide in [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro), talking to a **Cloudflare Worker** ([worker/](worker/)) that holds the OpenAI key and enforces abuse protection (Turnstile, origin allow-list, KV rate limits + daily cap). The bot's knowledge base is a no-RAG build-time index of all posts served at [/chat-index.json](src/pages/chat-index.json.ts); answer quality is tuned with promptfoo evals in [evals/](evals/). See [docs/chatbot.md](docs/chatbot.md). (This replaced the previous Zapier chatbot + Zapier Table sync, which was retired for cost reasons.)

Node >= 22.12.0 is required (see `engines` in [package.json](package.json)).

## Commands

```bash
npm run dev      # Astro dev server on http://localhost:4321
npm run build    # static build to dist/
npm run preview  # serve the production build locally
npm start        # astro preview --host 0.0.0.0 --port ${PORT:-4321} (Railway entrypoint)
```

There is no test runner, linter, or formatter configured.

## Architecture

- **Content collection** ([src/content.config.ts](src/content.config.ts)): a single `posts` collection globs `src/content/posts/**/*.{md,mdx}`. Frontmatter is Zod-validated: required `title`, `date` (Date), `excerpt`; optional `image`; `tags` defaults to `[]`. Adding a new frontmatter field requires updating the schema here — the build will fail otherwise.
- **Routing**: `src/pages/posts/[slug].astro` calls `getStaticPaths()` over the collection, sorts by date desc, and pre-computes `prevPost`/`nextPost` props for each entry. `src/pages/tags/[tag].astro` generates one page per tag. `src/pages/rss.xml.js` emits the RSS feed.
- **Layouts**: [BaseLayout.astro](src/layouts/BaseLayout.astro) owns `<head>` (SEO/OG/JSON-LD, Google Analytics `G-TRGMEDWTJM`, fonts, the Zapier chatbot script + embed), the site chrome (header/footer, dark-mode toggle, mobile menu), and Astro `<ClientRouter />` view transitions. [PostLayout.astro](src/layouts/PostLayout.astro) wraps it for article pages and computes reading time from the rendered slot HTML.
- **View transitions**: Astro's `<ClientRouter />` is enabled, which means soft-nav between pages. Three things piggy-back on this and must stay in sync:
  1. Google Analytics fires `gtag('config', ...)` on `astro:page-load` so soft-nav generates pageviews.
  2. Dark-mode reapplies on `astro:after-swap` (theme stored in `localStorage.theme`).
  3. Mobile menu + theme-toggle handlers re-bind on `astro:after-swap`.
  4. The chat widget ([ChatWidget.astro](src/components/ui/ChatWidget.astro)) uses `transition:persist` to survive nav without re-mounting, and self-guards its init so it binds exactly once.
  When adding interactive scripts to BaseLayout, follow the same pattern or they will only work on the initial page load.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (not a `tailwind.config.*` file — config is in CSS via `@theme` in [src/styles/global.css](src/styles/global.css)). The README's mention of `tailwind.config.mjs` is from the upstream template and does not apply here.
- **Images**: `astro:assets` with the `sharp` service is configured in [astro.config.mjs](astro.config.mjs) (webp, quality 80, responsive sizes 640–2000). Images referenced from markdown frontmatter or content live in `public/images/` and are referenced as `/images/foo.jpg`.

## Content and the chatbot knowledge base

`src/content/posts/*.md` is the source of truth for both the static site and the chatbot. The chatbot's knowledge base is the build-time index at [src/pages/chat-index.json.ts](src/pages/chat-index.json.ts) (title/excerpt/url/date/tags for every post), served as `/chat-index.json` and fetched+cached by the Cloudflare Worker. No RAG — see [docs/chatbot.md](docs/chatbot.md).

Implications when editing posts:
- New posts and edits flow into the chatbot automatically on the next Railway deploy (the index rebuilds with the site). There is no separate sync to keep in step.
- The index inherits Astro's Zod validation, so anything that builds is valid for the bot. Renames just change the `url` — no orphaned rows to clean up.

> The old Zapier Table sync (`astro-ai-chat - knowledge source`, documented in [docs/zap-knowledge-source-sync.md](docs/zap-knowledge-source-sync.md)) has been **retired** — it cost too much. That doc is kept for historical reference only; the Zap/Table are no longer live.

## Writing voice for posts

Posts are written in Alfred's first-person practitioner voice — plain-spoken, concrete, no hype. When drafting or editing a post, follow the `alfred-nutile-voice-style` skill. For technical build write-ups and tutorials specifically — anything teaching a developer to build the thing — also follow the `alfred-technical-writing-voice` skill ([.claude/skills/alfred-technical-writing-voice/SKILL.md](.claude/skills/alfred-technical-writing-voice/SKILL.md)): first-person from the trenches, honest about struggle, "let's break it down" pacing over real code, `> NOTE:` asides, real examples (never `foo`/`bar`), and the payoff-first teaching arc. The single most important rule, because it's what most often makes a draft "sound nothing like me":

- **No fake feelings — including the subtle, section-framing kind.** Never invent an emotional reaction Alfred didn't have. Beyond the obvious ("I was blown away," "my jaw dropped," "I'm so proud of this"), this covers the LinkedIn-flavored glue that's harder to spot and just as wrong: "the part I was so worried about," "the scary part of…," "here's the fun part," "that's the part that flips it for me," "and then something great happened." A post — especially a technical review — is analysis (tools, trade-offs, build patterns), not a feelings arc. State the point plainly. A real, specific fact ("migration numbering must be contiguous or the deploy is rejected") is fine; a manufactured mood or dramatized struggle is not. Genuine enthusiasm tied to a real event is fine and rare.
- **No condescension or spoon-feeding.** The audience is technical/curious builders who want to know how to build, choose tools, and use AI — not beginners to manage. Don't tell the reader what to notice ("Look down that column," "Notice how…," "See what happened?"), don't re-explain the obvious, don't lecture or throat-clear ("Here's the thing about any real app…"). One-clause jargon glosses are fine; otherwise assume intelligence. Write to a peer.
- **No reader-commanding tics:** "Read that again," "Stay with me," "Think about what that means," "Let that sink in," "Hold that thought."
- **No clichés:** "boil the ocean," "roach motel," "changes the game," "secret sauce."
- **Don't flatten his real conventions.** The `**TLDR:**` callout and genuine enthusiasm tied to a real event are his voice, not AI drift — leave them.

## Deployment

Railway serves the prebuilt static output via `npm start` (`astro preview`). The Vite preview server allow-lists `.dailyai.studio` so Railway preview domains work — keep this in [astro.config.mjs](astro.config.mjs) `vite.preview.allowedHosts` if changing host config.
