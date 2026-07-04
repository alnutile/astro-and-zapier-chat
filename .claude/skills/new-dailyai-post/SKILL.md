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

## The standard format (produce these, in order)

This is Alfred's house format for a post. Build it in this order:

1. **Cover image prompt** — write an image-generation prompt in the hand-drawn
   *notebook sketchnote* style (template below). Alfred renders it and provides
   the `cover.png` himself (sometimes as a URL to download).
2. **Title** — conversational, Title Case.
3. **TLDR** — a `> **TLDR:**` blockquote that sets up the whole piece.
4. **Skill link** (when there's a companion skill) — right under the TLDR:
   `👉 **The skill:** [link]`. Many of Alfred's posts ship with a reusable skill
   in the repo's `skills/` folder; link it here so readers can grab it.
5. **The article** — in his voice (see below).
6. **FAQs** — the `faq:` frontmatter for how-to posts (visible + schema).

### Cover image prompt — the notebook sketchnote style

Alfred likes a specific look: a hand-drawn guide on a notebook page. Use this
template, swapping in the post's content (a 2–3 step flow usually works):

> Handwritten notebook page photographed from above on a wooden desk, cream/
> off-white, slightly worn and lived-in. A hand-lettered title in bold black,
> with ONE keyword in blue. Below, a left-to-right / top-to-bottom flow of 2–3
> boxes — a blue-bordered box, a red-bordered box, a green-bordered box —
> connected by bold yellow arrows, each box with a short note and a small
> hand-drawn icon. Bullet points use arrow markers (→); key words are underlined
> or in different colors. A yellow callout box at the bottom holds the one-line
> takeaway. Natural overhead lighting, slight page curl at the edges, realistic
> paper texture; casual blue-ballpoint-and-markers sketchnote feel.

## Before writing

1. **Pull Alfred's voice.** Invoke the `alfred-nutile-voice-style` skill and write
   in that voice — conversational, first-person, short paragraphs, real examples,
   genuine enthusiasm without hype. This is non-negotiable for body copy.
2. **Respect the sponsor rule.** When the post involves switching away from a tool
   (especially **Zapier**, a sponsor), do NOT disparage it. Frame positively:
   "X was always good, this is just simpler for me now." (See the project memory
   `content-no-dump-on-tools`.)
3. **Humble about the _approach_, not about competence.** Alfred *is* experienced
   (decades of building software) — do NOT write self-deprecating "I'm no expert"
   disclaimers. That undersells him and rings false. The humility is about
   *method*, not ability: **there is more than one way to do this, and he's sharing
   what he sees working** — not claiming the one right way. Frame as "here's what's
   working for me — your path may differ," never "the correct way from on high"
   *and* never "I'm just a beginner." Avoid guru/only-way framing on one side and
   false modesty on the other. (See the project memory `content-voice-sharing-not-expert`.)

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

### Optional: FAQ (for tutorial / how-to posts)

If the post answers concrete "how do I…" questions, add a `faq:` list. It renders
a visible FAQ section AND `FAQPage` JSON-LD, which is what AI answer engines pull
into "how do I…" responses (good for GEO). Only add it when the Q&A genuinely
fits the post — the structured data must match real on-page content, so keep
answers as plain prose.

```yaml
faq:
  - question: "How do I keep an AI chatbot from running up a bill?"
    answer: "Put limits in front of it: a per-person rate limit, a hard daily cap, and a monthly spend limit in your provider's dashboard."
  - question: "Do I need a vector database for this?"
    answer: "Usually not to start — a simple list of your pages fits in the prompt."
```

## Cover image — give him a prompt, then ask for the rendered file

Alfred provides the hero image himself, but he likes a starting prompt. So:

1. **Offer a cover-image prompt** in the notebook sketchnote style (see "The
   standard format" above), tailored to the post.
2. Create the folder: `mkdir -p public/images/<slug>/`.
3. **Ask him to save the rendered image** to `public/images/<slug>/cover.png`
   (match the `image:` path in frontmatter). He may hand you a download URL —
   `curl` it straight into that path.
4. **Do not push until the file exists** — a missing hero image looks broken on
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
