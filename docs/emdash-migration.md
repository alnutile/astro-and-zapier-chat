# Moving chat.dailyai.studio to Cloudflare + EmDash

This branch moves the blog from a static Astro build on Railway to
[EmDash](https://docs.emdashcms.com) running on Cloudflare Workers. The theme,
every URL, and all 180 posts carry over. Posts move out of markdown files into
EmDash (D1 database), so new posts can be written in the EmDash admin or still
published from a markdown file with `npm run post:publish`.

## What changed

| Before | After |
| --- | --- |
| `output: 'static'`, `astro preview` on Railway | `output: 'server'` on Cloudflare Workers (`@astrojs/cloudflare`) |
| Posts in `src/content/posts/*.md` (content collection) | Posts in EmDash (`posts` collection in D1), tags in EmDash's `tag` taxonomy |
| New post = commit a markdown file + Railway deploy | New post = EmDash admin at `/_emdash/admin`, or `npm run post:publish -- file.md` (no deploy needed) |
| Astro markdown pipeline renders posts | `<PortableText>` with site renderers in `src/components/portable-text/` |
| `@astrojs/sitemap` | `src/pages/sitemap-index.xml.ts` + `sitemap-0.xml.ts` (same URLs) |
| Astro 6 | Astro 7 (EmDash 1.4 requires it) |

Unchanged: layouts, components, Tailwind theme, fonts, `public/images/...`,
Google Analytics, view transitions, `/posts/<slug>`, `/posts/<slug>.md`,
`/tags/<tag>`, `/journal`, `/faq`, `/about`, `/rss.xml`, `/llms.txt`,
`/llms-full.txt`, `/sitemap-index.xml`, `robots.txt`.

`src/content/posts/` stays in the repo as the archive the seed is built from.
After cutover, EmDash is the source of truth: editing a markdown file there no
longer changes the site unless you re-publish it with `npm run post:publish`.

## How the content was migrated

`npm run seed:build` (`scripts/build-emdash-seed.mjs`) writes `seed/seed.json`:
the `posts` collection schema (title, date, excerpt, image, content, faq,
tag_order), the `tag` taxonomy, and every post as Portable Text.

The markdown is parsed with the same remark + GFM parser the old build used
(`scripts/lib/post-markdown.mjs`), not EmDash's built-in converter, which drops
tables, `*italics*`, multi-paragraph quotes, `---`, and bare-URL links. The
converter also bakes in smartypants (curly quotes, dashes) that the old build
applied at render time, and flags a few markdown quirks (loose lists, image +
caption paragraphs, empty `>` lines, adjacent quotes) so the renderers in
`src/components/portable-text/` reproduce the old HTML.

Drafts (`draft: true`) import as EmDash drafts and stay hidden, as before.

### Verification done on this branch

Against production (chat.dailyai.studio) vs. this build running locally on
workerd with the seed imported through the real setup wizard:

- Sitemap: same 221 URLs, nothing missing or extra.
- Every one of the 221 pages returns 200 with the same `<title>`, meta/OG
  tags and JSON-LD. Drafts and unknown slugs return 404 on both.
- Article text matches word-for-word on all 178 public posts (one exception
  below). Tag-by-tag HTML structure (headings with the same `id` anchors,
  links, lists, tables, code, images) matches except as listed below.
- `/rss.xml`, `/llms.txt`, `/journal.md`, `/about.md` are byte-identical.
- Full-page screenshots diffed pixel-for-pixel across all pages; see the PR
  for the results.

Known, intentional differences:

- `tools-skills-mcp-when-to-use-which`: the old build rendered `”But` (a
  backwards quote) at the start of a heading and in a table; it's now `“But`.
- A code block inside a blockquote (one spot in
  `green-means-ship-cicd-with-confidence`) renders as quote / code / quote,
  since Portable Text can't nest a code block in a quote.
- Three headings that contained only an image (`![](x.png)` followed by
  `---` makes a setext `<h2>`) now render the image without the `<h2>`
  wrapper; two empty headings are dropped.
- EmDash adds a `/sitemap.xml` of its own (the old site 404'd there).
  `robots.txt` still points crawlers at `/sitemap-index.xml`, which is
  unchanged.
- `/posts/<slug>.md` and `/llms-full.txt` now carry curly quotes (the stored
  text has them) and are generated from Portable Text, so minor markdown
  formatting differs from the original files.

## Cutover runbook

Nothing below has been run against your Cloudflare account. Do it in this
order so the live site never breaks.

> NOTE: don't merge this branch into `main` until step 6. Railway deploys
> `main`, and this branch no longer has the `npm start` static server Railway
> runs, so a merge before cutover takes the Railway site down.

### 1. Prerequisites

- A Cloudflare account. The `dailyai.studio` zone must be on Cloudflare (same
  account) to attach `chat.dailyai.studio` to the Worker. If DNS is elsewhere
  today, move the zone first (or use a CNAME setup) - check this before
  anything else.
- Workers Paid plan is not required for this setup (no sandboxed plugins).
- `npm install`, then `npx wrangler login`.

### 2. First deploy

```bash
npm run seed:build   # only needed if src/content/posts changed since the last build
npm run deploy       # astro build && wrangler deploy
```

Wrangler creates the `dailyai-blog` D1 database and `dailyai-blog-media` R2
bucket on first deploy (names in `wrangler.jsonc`). It prints a
`*.workers.dev` URL. The public pages will be empty until step 3.

### 3. Import the content (setup wizard, step 1)

Open `https://<worker>.workers.dev/_emdash/admin`. Step 1 of the wizard:
title `DailyAi`, keep **Sample content** selected (that's the 180 posts from
`seed/seed.json`), Continue. It takes about 10 seconds.

Check `https://<worker>.workers.dev/journal` and a few posts.

Stop at step 2 (account + passkey). Passkeys are bound to the hostname they
are created on, so create the admin account on the real domain in step 5,
not on workers.dev.

### 4. Point the domain at the Worker

Add the custom domain to `wrangler.jsonc` and deploy again:

```jsonc
"routes": [{ "pattern": "chat.dailyai.studio", "custom_domain": true }]
```

Remove the domain from the Railway service first (Railway → Settings →
Domains), otherwise the DNS record conflicts.

### 5. Finish setup on the real domain

Open `https://chat.dailyai.studio/_emdash/admin`, finish the wizard (email,
name, passkey). Then in the admin: **Settings → General** confirm the site URL
is `https://chat.dailyai.studio`. (EmDash's "hide from search engines" setting
works through its `EmDashHead` component, which this theme doesn't use, so it
doesn't touch these pages; `robots.txt` is still the one in `public/`.)

Spot-check: `/`, `/journal`, a post, `/tags/ai`, `/rss.xml`, `/llms.txt`,
`/sitemap-index.xml`, a `/posts/<slug>.md`.

### 6. Merge and retire Railway

- Merge this branch.
- Optional but recommended: connect the repo in Cloudflare (Workers → your
  Worker → Settings → Builds) so pushes to `main` deploy automatically, like
  Railway did. Build command `npm run build`, deploy command
  `npx wrangler deploy`.
- Delete the Railway service once you're happy.

## Day to day

- **New post in the admin:** `/_emdash/admin` → Posts → New. Fields mirror the
  old frontmatter: Title, Date, Excerpt, Cover image URL, Content, FAQ. Tags
  are in the sidebar. Publishing is live within seconds (EmDash purges the
  page cache), no deploy.
- **New post from markdown:** write `src/content/posts/<slug>.md` as before,
  then `EMDASH_TOKEN=... npm run post:publish -- src/content/posts/<slug>.md --url https://chat.dailyai.studio`.
  Create the token in the admin (Settings → API tokens). Re-running it
  updates the post.
- **Images:** files in `public/images/<slug>/` ship with a deploy (push to
  `main` with Workers Builds, or `npm run deploy`). Images uploaded in the
  admin go to R2 and need no deploy.
- **Local dev:** `npm run dev`, then open
  `http://localhost:4321/_emdash/api/setup/dev-bypass?content=1` once to
  import the seed into the local D1 and sign in as a dev admin. Local data
  lives in `.wrangler/state` (gitignored); delete it to start over.

## Caching

Public routes are cached in the Workers Cache (`routeRules` in
`astro.config.mjs`, `maxAge` 1h, `swr` 1 day, tagged `posts`). EmDash purges
the `posts` tag on every publish/unpublish/live edit, so changes show within
seconds. Cloudflare limits cache purges to 5 per minute; if one gets dropped
during heavy editing, pages catch up within the hour.
