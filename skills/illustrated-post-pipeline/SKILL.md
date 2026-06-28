---
name: illustrated-post-pipeline
description: >
  End-to-end pipeline for turning a finished article into a fully illustrated,
  published post on the DailyAi blog. Use this whenever Alfred has an article (a
  draft, a markdown file, or pasted text) and wants images generated AND the post
  shipped to the site — "illustrate this and publish it," "generate the images
  and push to the blog," "make the diorama images and post it," or any time both
  image generation and CMS publishing are needed in one go. This wraps two
  things: (1) generating images with the Higgsfield MCP in Alfred's miniature
  diorama style, and (2) the existing `new-dailyai-post` publish flow (frontmatter,
  image folders, build check, commit/deploy). If only publishing is needed with
  Alfred supplying his own cover, use `new-dailyai-post` instead.
---

# Illustrated post pipeline

This is the full assembly line: article in, illustrated live post out. It chains
image generation onto the publish flow so nothing gets dropped between "the
writing is done" and "it's on the site with pictures."

Two phases. Do them in order.

## Phase 0 — before you generate anything

1. **Lock the article first.** Images should illustrate final copy, not a moving
   target. If the body is still changing, finish that (run the
   `alfred-nutile-voice-style` skill for the prose) before generating images.
2. **Pick the slug** — clean kebab-case, becomes the URL and the image folder
   name. Example: `tools-skills-mcp-when-to-use-which`.
3. **List the image beats.** Walk the article and decide where a visual helps:
   one cover/hero plus one image per major section or concept. Write a one-line
   scene description for each. Number them `01` (cover) through `NN`.

## Phase 1 — generate the images (Higgsfield MCP)

Higgsfield tools are `mcp__<server>__*` (e.g. `generate_image`, `job_display`,
`models_explore`, `show_plans_and_credits`). Load them via ToolSearch if deferred.

**Model:** use `nano_banana_pro` — it renders text/labels on signs and chalkboards
cleanly, which most of these scenes need. Preflight cost once with `get_cost: true`
(it ran ~2 credits per 1k image last time).

**Aspect ratio:** `16:9` for blog images, consistent across the set.

**Alfred's house image style — miniature diorama (Tatsuya Tanaka feel).** Build
every prompt on this base, swapping in the scene:

> Miniature diorama photography of tiny figurine people [ACTION] [GIANT OBJECT/SCENE].
> Shot with a macro lens, shallow depth of field, tilt-shift effect, soft natural
> lighting. The everyday objects appear massive compared to the tiny detailed
> HO-scale figurines. Hyper-realistic, warm tones, playful composition, cinematic
> color grading.

Tips that worked:
- Put any needed **labels** as physical text in the scene (a giant block labeled
  'MCP', a chalkboard, a signpost) — nano_banana_pro renders these well.
- For the **cover**, add "generous empty space at the top for a title overlay."
- Turn diagrams (flowcharts, bar charts, layer stacks) into physical objects the
  figurines interact with — a flowchart painted on the ground, 3D bar blocks, a
  layered machine. Don't ask for a flat chart.

**Concurrency:** the plan caps at **4 concurrent jobs**. Fire in batches of ≤4,
then poll. `generate_image` returns a `pending` job id; poll with `job_display`
until `status: completed`, which returns `results.rawUrl` (the full-res PNG).

**Download into the repo** (not the scratchpad — the site needs them in `public/`):

```bash
SLUG="your-slug"
mkdir -p "public/images/$SLUG"
# cover:
curl -s -o "public/images/$SLUG/cover.png" "<rawUrl for 01>"
# inline images keep their numbered names:
curl -s -o "public/images/$SLUG/02-name.png" "<rawUrl>"
# ...repeat for the rest
ls -la "public/images/$SLUG"
```

**Use lower-res "-medium" versions in the post.** The full-res PNGs from
Higgsfield are ~2.5 MB each — too heavy for a page with a dozen images. Alfred
exports a smaller copy of each (he may hand them over named like
`NN-name Medium.png`). Normalize those names to `NN-name-medium.png` (space →
hyphen, lowercase) and reference the `-medium` files in the post. Keep the
full-res originals in the same folder as the source.

```bash
cd "public/images/$SLUG"
for f in *" Medium.png"; do mv -- "$f" "$(echo "$f" | sed 's/ Medium\.png$/-medium.png/')"; done
```

If Alfred hasn't pre-made the medium copies, downscale them yourself (ImageMagick:
`mogrify -resize 1200x -path . -format png -quality 80 ...` or `sips` on macOS).

The cover is referenced from frontmatter (`image:`), so it does NOT also go inline
in the body — `PostLayout.astro` renders it as the featured image. Use the medium
cover too (`cover-medium.png`). Every other image is referenced inline as
`![alt](/images/$SLUG/NN-name-medium.png)`.

## Phase 2 — publish (hand off to new-dailyai-post)

Follow the `new-dailyai-post` skill for the publishing mechanics. The essentials:

- Create `src/content/posts/$SLUG.md`. Frontmatter is Zod-validated
  ([src/content.config.ts](../../src/content.config.ts)) — required `title`,
  `date` (YYYY-MM-DD), `excerpt`; optional `image`, `tags`, `faq`. A wrong field
  fails the build.
- Body starts with `## TLDR` (no top-level `#` — the title H1 comes from
  frontmatter). Then the article in Alfred's voice.
- Add a `faq:` block for explainer/how-to posts — it renders a visible FAQ AND
  `FAQPage` JSON-LD, which AI answer engines pull from (good for GEO). Keep
  answers as plain prose that matches the on-page text.
- Reuse existing tags where possible (lowercase): `ai`, `no-code`, `agents`,
  `automation`, etc.

### Validate, then ship

1. **Schema/asset check.** If `npm run build` can't run locally (e.g. the repo's
   `node_modules` was installed on a different OS and the sandbox can't write to
   it), at minimum verify: frontmatter fields + date format, body opens with
   `## TLDR`, and every `/images/$SLUG/...` referenced in the body actually exists
   under `public/`. The real authoritative build runs on Railway at deploy.
2. **Commit + push to `main`** — this is a production deploy on Railway and it
   refreshes the chatbot's `/chat-index.json` automatically. End the commit with
   the standard `Co-Authored-By` trailer.
3. **Confirm live:**
   `curl -s -o /dev/null -w "%{http_code}" https://chat.dailyai.studio/posts/$SLUG/`
   should return `200`.

> Note: if running from a sandbox that can't write to the repo's `.git` (cross-OS
> mount), do the commit/push from the Mac terminal instead. Don't force it — a
> stale `.git/index.lock` on a production repo is not worth it.

## Quick checklist

- [ ] Article finalized + voice pass done
- [ ] Slug chosen; image beats listed (cover + per-section)
- [ ] Images generated with `nano_banana_pro` in the diorama style, 16:9
- [ ] All images downloaded to `public/images/$SLUG/`; `-medium` copies made and referenced (full-res kept as source)
- [ ] `src/content/posts/$SLUG.md` written; frontmatter valid; body opens `## TLDR`
- [ ] Cover only in frontmatter; other images inline; every path exists
- [ ] FAQ added for how-to posts
- [ ] Built/validated, committed, pushed to main, verified 200 live
