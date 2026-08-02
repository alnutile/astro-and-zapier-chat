---
title: "Green Means Ship: The CI/CD That Lets a Vibe-Coded App (and an AI) Deploy With Confidence"
date: 2026-08-02
excerpt: "I let an AI open pull requests against this repo and I sleep fine — not because I trust the AI, but because the pipeline refuses anything red. Here's the whole CI/CD setup, five small files you can read, that makes shipping fast feel boring in the best way."
image: "/images/green-means-ship-cicd-with-confidence/cover.png"
tags: [ai, ci-cd, vibe-coding, security, railway, supabase, automation]
draft: true
faq:
  - question: "What does CI/CD actually do for a small app?"
    answer: "It turns the question is this safe to ship into a yes or no that a machine answers. On every pull request it runs the same checks you would run locally — typecheck, lint, test, build — and it blocks the merge if any of them fail. Once they pass and you merge, the deploy happens on its own."
  - question: "Do I need a separate deploy step in my pipeline?"
    answer: "Often no. If your host watches your main branch, merging is the deploy. In this setup Railway redeploys on every push to main, so there is no deploy button in the pipeline at all. The pipeline's only job is to keep main green, and the host handles the rest."
  - question: "How do database migrations fit into CI/CD?"
    answer: "Ship the migration in the same pull request as the code that needs it. A GitHub Action runs the migration on push to main so the schema change and the code land together. Use an idempotent push that only applies versions the project has not recorded yet, so re-runs are safe and parallel branches with interleaved timestamps do not break each other."
  - question: "How do I keep API keys out of the repo when the pipeline needs them?"
    answer: "Store them as GitHub Actions secrets, and have the workflow inject them at deploy time. In this setup the Anthropic key lives as an Actions secret and gets synced onto the Supabase project during the functions deploy. It exists in the run for a few seconds and never gets committed. Anything prefixed VITE_ is public by design; real secrets are never that."
  - question: "How can it be safe to let an AI push code to a repo?"
    answer: "The AI does not push to main. It works on a feature branch and opens a pull request, exactly like a person, and a human reviews it. It has to pass the same four checks anyone else does. Because bot-opened pull requests do not trigger the normal checks automatically, the workflow re-runs those same checks itself against the branch, so nothing skips the gate based on who wrote it."
---

> **TLDR:** I let an AI open pull requests against one of my repos, and I don't lose sleep over it. Not because I trust the AI — because the pipeline refuses to ship anything red. That's the whole point of CI/CD: turn "is this safe to ship?" into a yes/no the machine answers, and once it says yes, make shipping boring and automatic. This is a walk through the actual setup — five small files you can read on one screen — from my [supabase-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template.

👉 **The repo:** [alnutile/supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) — a GitHub template. Every project I spin up from it gets Supabase auth, RLS, realtime, and storage, plus this CI/CD wiring, out of the gate.

---

A while back I wrote [Vibe Coding With Confidence](/posts/vibe-coding-with-confidence/) — how to get a vibe-coded app secure, hosted, and online without the whole thing feeling scary. This is the follow-up I kept wanting to write, because there's a piece under all of that which does the real work: the pipeline.

Here's the thing I keep coming back to. AI writes more of my code every month. This repo literally has an AI open its own pull requests. So the bottleneck isn't *typing* code anymore — it's *trusting* it. And you can't trust code by staring harder at it, or by being a hero who never has a bad day. You trust it by making the check mechanical: something runs on every change, and nothing red is allowed through.

That's CI/CD. Not a fancy platform, not a 40-step Jenkins file. Just: **every arrow in your process has a gate, and the gate is code you can read.** Let's break it down.

## The mental model: three lanes, one rule each

Before any YAML, here's the whole shape on one napkin:

```
feature branch  ──PR──►  main  ──merge──►  production
   "prove it"          "always            "boring &
                       deployable"         automatic"
```

- **Feature branch:** cheap, disposable, mess allowed. A pull request is a *question* — "is this safe?"
- **`main`:** the answer is always "yes," because nothing red ever gets in. `main` is your known-good.
- **Production:** a *consequence* of merging, not a separate manual event you go do later.

The magic isn't any one tool. It's that the answer to "is this safe?" stops being a judgment call and becomes a status check. Green or red.

## The gate — `ci.yml`

Here's the file that does the gatekeeping. It runs on **every pull request** and **every push to `main`**. Four steps.

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - name: Typecheck
        run: npm run typecheck
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
        env:
          # Public placeholders — the build only needs these to be defined.
          VITE_SUPABASE_URL: https://placeholder.supabase.co
          VITE_SUPABASE_ANON_KEY: sb_publishable_placeholder
```

Typecheck, lint, test, build. Now here's the detail that makes it click, and it's easy to skim right past: those are the **exact same four commands** as my local Definition of Done in `CLAUDE.md`:

```
npm run typecheck && npm run lint && npm test && npm run build
```

So "works on my machine" and "passes CI" are the same checklist. One of them just can't be skipped on a day when I'm tired and in a hurry. There's no local-vs-CI drift to argue about, because there's no second list.

> NOTE: Look at the `env` block on the build. The build only needs those Supabase vars to be *defined*, not real — so they're public placeholders. Real secrets never touch CI logs. More on that below, because it matters.

## Small branches, fast merges

The gate only stays honest if the branches stay small. A branch that lives for three weeks is just risk with a due date — by the time you merge it, the world moved and the checks are testing a fiction.

So: short-lived branches, merge often, keep `main` always releasable. And one setting turns "the check exists" into "the check is mandatory" — **branch protection** on `main`. Require the CI check to pass before anyone can merge. Without that, CI is a suggestion. With it, red literally blocks the button. That's the difference between a pipeline and a decoration.

## Merge = deploy — `railway.json`

Now the fun part, which is that there's almost nothing here. Railway deploys **from GitHub on every push to `main`**. There is no deploy step in the pipeline at all — the host watches the branch.

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build":  { "builder": "NIXPACKS", "buildCommand": "npm run build" },
  "deploy": { "startCommand": "npm start", "restartPolicyType": "ON_FAILURE", "restartPolicyMaxRetries": 10 }
}
```

From my `DEPLOY.md`: *"Every push to `main` redeploys automatically."* HTTPS is on by default. So the entire "deploy" story is: merge the pull request, walk away, the site updates. Boring is the compliment here. Boring means I'm not the single point of failure standing over a deploy button at 11pm.

Now — real talk, because it's never *quite* that clean the first time. Here's a papercut that got me and is worth naming out loud: a fully green build can still 503 or 403 on Railway until you let the host through. Astro's preview server (and Vite generally) will reject an unknown host. The fix is one line:

```ts
// vite.config.ts
preview: { allowedHosts: ['.up.railway.app'] }
```

CI/CD isn't only about tests passing. It's also about the boring host-config gotchas that make "green build" and "actually live" two different facts until you close the gap. Paste the 503 into your AI session, it'll point you here.

## Infra ships with the code — migrations and functions

This is the part most people skip, and it's the best part. Your schema and your edge functions should live and die in the *same* pull request as the code that needs them. Not "merge the code today, remember to run the migration by hand tomorrow." Together.

**Migrations** — `supabase-migrations.yml` fires on push to `main` that touches `supabase/migrations/**`, and runs one command:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'supabase/migrations/**'
      - '.github/workflows/supabase-migrations.yml'
# ...
      - name: Push migrations
        run: supabase db push --include-all
```

Why `--include-all`? This is a genuinely nice design note from the file's own comment. When you've got parallel feature branches — and the AI opens several — they create **interleaved migration timestamps.** A branch whose migration sorts "before" one that's already been applied will blow up with *"Found local migration files to be inserted before…"* unless you tell it to include everything. And `db push` is idempotent: it only applies versions the project hasn't recorded yet, so re-runs are safe. You can re-run it all day and nothing double-applies.

**Functions + secrets** — `supabase-functions.yml` fires on push touching `supabase/functions/**`. It deploys the edge function *and* syncs the API key from a GitHub Actions secret onto the Supabase project:

```yaml
      - name: Sync ANTHROPIC_API_KEY function secret
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          if [ -n "$ANTHROPIC_API_KEY" ]; then
            supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" --project-ref "$SUPABASE_PROJECT_REF"
          fi
      - name: Deploy run-eval
        run: supabase functions deploy run-eval --project-ref "$SUPABASE_PROJECT_REF"
```

So the key never lives in the repo. It sits as a GitHub Actions secret, gets injected onto the project during the deploy, and that's it.

## Security the pipeline enforces

That last bit is worth pulling out on its own, because the pipeline isn't only a quality control — it's a *security* control.

The rule I lean on, same one from [the vibe-coding post](/posts/vibe-coding-with-confidence/): anything prefixed `VITE_` is **public** — it's shipped to the browser, so treat it as visible to the world. That's why the CI build can use placeholder `VITE_` values; they were never secret. Real secrets — a `service_role` key, the `ANTHROPIC_API_KEY` — only ever exist as **Actions secrets**, injected for a few seconds at deploy time, never committed.

So the pipeline is where "don't commit secrets" stops being a sticky note and becomes structural. The build proves you didn't *need* the real secret to build. The deploy is the only place the real one shows up, and only for as long as it takes to use it.

## The payoff — an AI ships through the same gate

Here's what all of it was for. `claude-feature.yml`.

I drag a card, the issue gets labeled `approved-for-work`, and this workflow runs Claude Code. It builds on a `feature/issue-N` branch and **opens a pull request.** It cannot push to `main`. Same lane as a human — prove it on a branch, open the question, a person reviews, the merge lane ships it. From the file's own header:

> *"the agent works on a branch and opens a PR — it cannot push to main … A human reviews and the board's merge lane ships it."*

Two things in this file are worth reading out loud.

**First — define what "green" actually means.** It's not "the agent didn't crash." It's "a pull request exists." Those are very different, and the workflow checks the real one first:

```yaml
      # Green must mean "a PR exists", not "the agent didn't crash". Check this FIRST…
      - name: Verify a PR was opened
        run: |
          pr=$(gh pr list --repo "$GITHUB_REPOSITORY" --head "$branch" --state open --json number --jq '.[0].number // empty')
          if [ -z "$pr" ]; then
            gh issue comment ... --body "⚠️ The build run finished without opening a PR…"
            echo "::error::No open PR for $branch…"; exit 1
          fi
```

An agent that runs to completion and produces *nothing* should be a failure, not a quiet success. So the check is for the outcome you actually wanted.

**Second — and this is the deep cut — run your gate even when the platform won't run it for you.** GitHub has an anti-recursion rule: pull requests opened *by a bot* don't trigger `pull_request` workflows. Which means the AI's PR wouldn't get the normal four checks automatically. So this workflow just... runs them itself, against the pushed branch:

```yaml
      - name: Test the built branch
        run: |
          git fetch origin "$branch"; git checkout "$branch"
          npm ci
          npm run typecheck
          npm run lint
          npm test
          npm run build
```

That's the whole principle in five lines: **never let code skip the gate because of who — or what — wrote it.** The platform gives the bot a free pass, and I take it back. Human or AI, you walk through the same green door.

> NOTE: There's a sixth file I'll only mention — `update-readme.yml` regenerates the README on every merge and commits it back with `[skip ci]`. It's a clean little example of building an automated loop *without* an infinite one — four independent guards keep it from triggering itself. Good reading if you're wiring up any self-updating job.

## Wrapping up

So that's the pipeline. Five files you can read on one screen:

- **`ci.yml`** — the gate. The same four commands as my local Definition of Done, just un-skippable.
- **`railway.json`** — merge is the deploy. No button.
- **`supabase-migrations.yml`** — schema ships with the code that needs it, idempotently.
- **`supabase-functions.yml`** — functions and secrets as code; the key never lives in git.
- **`claude-feature.yml`** — the AI ships through the exact same gate, and re-runs it when the platform won't.

The reason I can let an AI open pull requests here isn't that the AI is smart. It's that it has to walk through the same green gate I do — and that gate is a handful of files I can read.

If you want a place to start: grab the [supabase-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template, spin a project from it, and open `.github/workflows/ci.yml`. Change one line to break a check on purpose, push it, and watch the merge go red. Red is the system working. Then fix it, watch it go green, merge, and see the site update on its own. That whole loop, on your own repo, is the fastest way to feel why this matters.

Green means ship.
