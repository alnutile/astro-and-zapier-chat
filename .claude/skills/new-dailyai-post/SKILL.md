---
name: new-dailyai-post
description: >
  Create and publish a new post on the DailyAi blog (this Astro repo at
  chat.dailyai.studio). Use this whenever Alfred wants to add, write, draft, or
  publish a post, article, or journal entry here — including "turn this into a
  post," "write up X for the blog," "new journal entry," or pasting content he
  wants posted. Handles the frontmatter schema, slug + image conventions, his
  writing voice, the don't-disparage-sponsors rule, a build check, and the
  commit/deploy (which also refreshes the chatbot's knowledge base). Trigger this
  even if he doesn't say "blog" — if he's clearly producing a post for this site,
  use it so nothing gets skipped.
---

# New DailyAi post

Publishing a post here is mechanically simple but has a few easy-to-miss steps
that, if skipped, either break the live build or ship an ugly/inconsistent post.
This skill is the checklist so every post lands clean. The *writing* is still a
collaboration — this just nails everything around it.

## Before writing

1. **Pull Alfred's voice.** Invoke the `alfred-nutile-voice-style` skill and write
   in that voice — conversational, first-person, short paragraphs, real examples,
   genuine enthusiasm without hype. This is non-negotiable for body copy.
2. **Respect the sponsor rule.** When the post involves switching away from a tool
   (especially **Zapier**, a sponsor), do NOT disparage it. Frame positively:
   "X was always good, this is just simpler for me now." (See the project memory
   `content-no-dump-on-tools`.)

## Frontmatter (exact schema — the build is Zod-validated and will fail otherwise)

Create `src/content/posts/<slug>.md`. The filename is the URL slug, so use clean
kebab-case (e.g. `moving-my-chat-to-cloudflare.md` → `/posts/moving-my-chat-to-cloudflare/`).

```yaml
---
title: "Title in Title Case"
date: 2026-06-08            # today's date, YYYY-MM-DD
excerpt: "One or two sentences that sell the post — this shows in the feed AND feeds the chatbot."
image: "/images/<slug>/cover.png"
tags: [ai, automation, no-code]   # lowercase; reuse existing tags where possible
---
```

- Required: `title`, `date`, `excerpt`. Optional: `image`, `tags` (defaults `[]`).
- Open the body with a `> **TLDR:**` or "Big Idea" line — it's his house style and
  helps skimmers. Then `---`, then the post.
- Keep frontmatter simple (`key: value`); no exotic YAML.

## Cover image — ALWAYS ask Alfred for one

Alfred wants to provide the hero image himself. So:

1. Create the folder: `mkdir -p public/images/<slug>/`.
2. **Stop and ask him** to save his image to `public/images/<slug>/cover.png`
   (the convention; match the `image:` path in frontmatter).
3. **Do not push until the file exists** — a missing hero image looks broken on
   the live post. Verify with `ls public/images/<slug>/cover.png` before deploying.

## Verify, then ship

1. **Build first:** `npm run build`. This catches frontmatter/schema errors before
   they hit the live site. Confirm `/posts/<slug>/` appears in the output.
2. **Commit + push to `main`.** This is a production deploy on Railway AND it
   refreshes the chatbot — `/chat-index.json` rebuilds, so the bot knows the new
   post on the next deploy automatically. No separate step.
   - End the commit message with the standard `Co-Authored-By` trailer.
3. **Confirm live:** `curl -s -o /dev/null -w "%{http_code}" https://chat.dailyai.studio/posts/<slug>/`
   should return `200`.

## Quick checklist

- [ ] Voice skill pulled, body in Alfred's voice
- [ ] No disparaging of sponsor tools
- [ ] `src/content/posts/<slug>.md` with valid frontmatter + TLDR opener
- [ ] Asked Alfred for `cover.png`; confirmed it exists
- [ ] `npm run build` passes
- [ ] Committed + pushed to main
- [ ] Verified `/posts/<slug>/` returns 200 live
