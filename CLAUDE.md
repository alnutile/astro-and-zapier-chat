# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

This is the **owner's active, in-use blogging platform** at `chat.dailyai.studio` (deployed on Railway) — not a template to experiment with. There are ~158 published posts in [src/content/posts/](src/content/posts/) and new posts are added regularly. Treat changes as production-impacting: be conservative with anything that touches the frontmatter schema, post URL structure (`/posts/[slug]`, `/tags/[tag]`), or the Zapier sync contract.

Built from the Brook Astro template. It is a **static site** (`output: 'static'`) that pairs with a **Zapier chatbot** embedded sitewide via a `<zapier-interfaces-chatbot-embed>` web component in [src/layouts/BaseLayout.astro](src/layouts/BaseLayout.astro). The chatbot's knowledge source is a Zapier Table populated from `src/content/posts/*.md` via the sync flow described in [docs/zap-knowledge-source-sync.md](docs/zap-knowledge-source-sync.md).

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
  4. The Zapier chat embed uses `transition:persist` to survive nav without re-mounting.
  When adding interactive scripts to BaseLayout, follow the same pattern or they will only work on the initial page load.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (not a `tailwind.config.*` file — config is in CSS via `@theme` in [src/styles/global.css](src/styles/global.css)). The README's mention of `tailwind.config.mjs` is from the upstream template and does not apply here.
- **Images**: `astro:assets` with the `sharp` service is configured in [astro.config.mjs](astro.config.mjs) (webp, quality 80, responsive sizes 640–2000). Images referenced from markdown frontmatter or content live in `public/images/` and are referenced as `/images/foo.jpg`.

## Content and the Zapier sync

`src/content/posts/*.md` is the source of truth for both the static site and the chatbot's knowledge base. On every push to `main`, a Zap (documented in [docs/zap-knowledge-source-sync.md](docs/zap-knowledge-source-sync.md)) fetches changed posts from GitHub raw, parses frontmatter, and upserts rows into the Zapier Table `astro-ai-chat - knowledge source` (id `01KQB3DZWRTN6SRRCEKN9TCYYT`) keyed by `file_path`.

Implications when editing posts:
- The Zap's Python parser in the doc handles only simple `key: value` frontmatter with optional `"..."` quoting — no YAML lists, multi-line strings, or block scalars. Astro's schema is stricter (it validates types). If you add complex frontmatter the site will build but the chatbot sync may silently drop fields.
- One row per file path. Renaming a post creates a new row and orphans the old one (the doc's "Path C" deletion branch is optional and may not be enabled).
- The initial table content was seeded from a `knowledge-source-bootstrap.csv` (gitignored, local-only). Treat the Zap as **incremental** — don't expect it to backfill from scratch.

## Deployment

Railway serves the prebuilt static output via `npm start` (`astro preview`). The Vite preview server allow-lists `.dailyai.studio` so Railway preview domains work — keep this in [astro.config.mjs](astro.config.mjs) `vite.preview.allowedHosts` if changing host config.
