---
title: "Green Means Ship: The CI/CD That Lets a Vibe-Coded App (and an AI) Deploy With Confidence"
date: 2026-08-02
excerpt: "I let an AI open pull requests against this repo. It works because the pipeline won't ship anything red — typecheck, lint, test, build all have to pass before anything merges, and merging is what deploys. Here's the whole setup, five small files you can read."
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

> **TLDR:** I let an AI open pull requests against one of my repos. It's not that I trust the AI — it's that the pipeline won't let anything red through. That's all CI/CD really is: the checks run on every change, and if they fail, nothing merges. Once they pass and you merge, the deploy happens on its own. This is a walk through the actual setup — five small files — from my [supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template.

👉 **The repo:** [alnutile/supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) — a GitHub template. Every project I spin up from it gets Supabase auth, RLS, realtime, and storage, plus this CI/CD wiring, out of the gate.

---

I wrote [Vibe Coding With Confidence](/posts/vibe-coding-with-confidence/) a while back — getting a vibe-coded app secure, hosted, and online. This is the piece underneath all of that, the one doing the real work: the pipeline.

AI writes more of my code every month. This repo has an AI open its own pull requests. So the slow part isn't typing the code anymore — it's trusting it. And you don't trust code by reading it harder. You trust it by making the check mechanical: something runs on every change, and nothing red gets through.

That's CI/CD. Not a big platform, not a 40-step Jenkins file. Every step in the process has a gate, and the gate is code you can read. Let's break it down.

## The mental model: three lanes, one rule each

Before any YAML, here's the whole shape:

```
feature branch  ──PR──►  main  ──merge──►  production
   "prove it"          "always            "boring &
                       deployable"         automatic"
```

- **Feature branch:** cheap, disposable, mess allowed. A pull request is a *question* — "is this safe?"
- **`main`:** the answer is always "yes," because nothing red ever gets in. `main` is your known-good.
- **Production:** a *consequence* of merging, not a separate manual event you go do later.

It's not any one tool doing this. It's that "is this safe?" stops being a judgment call and becomes a status check. Green or red.

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

Typecheck, lint, test, build. And here's the part I care about: those are the same four commands as my local Definition of Done in `CLAUDE.md`:

```
npm run typecheck && npm run lint && npm test && npm run build
```

So "works on my machine" and "passes CI" are the same list. The difference is CI can't skip a step on a day I'm tired and in a hurry. There's no second checklist to drift.

> NOTE: The `env` block on the build is worth a second. The build only needs those Supabase vars to be *defined*, not real, so they're public placeholders. Real secrets never touch CI logs. More on that below.

## Small branches, fast merges

The gate only stays honest if the branches stay small. A branch that sits for three weeks is just risk with a due date — by the time you merge, the world moved and you're testing something that isn't true anymore.

So: short branches, merge often, keep `main` releasable. And one setting turns "the check exists" into "the check is required" — **branch protection** on `main`. Require CI to pass before anyone can merge. Without it, CI is a suggestion. With it, red blocks the button.

## Merge = deploy — `railway.json`

There's almost nothing to this one. Railway deploys from GitHub on every push to `main`. No deploy step in the pipeline at all — the host watches the branch.

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build":  { "builder": "NIXPACKS", "buildCommand": "npm run build" },
  "deploy": { "startCommand": "npm start", "restartPolicyType": "ON_FAILURE", "restartPolicyMaxRetries": 10 }
}
```

From my `DEPLOY.md`: *"Every push to `main` redeploys automatically."* HTTPS is on by default. So the whole deploy story is: merge, walk away, the site updates. That's the goal — I'm not the person standing over a deploy button at 11pm.

It's never quite that clean the first time, though. Here's one that got me: a fully green build can still 503 or 403 on Railway until you let the host through. Astro's preview server (Vite, really) rejects an unknown host. One line fixes it:

```ts
// vite.config.ts
preview: { allowedHosts: ['.up.railway.app'] }
```

So CI/CD isn't only about tests passing. It's the boring host-config stuff too — the gap between "green build" and "actually loading." Paste the 503 into your AI session and it'll point you right here.

## Infra ships with the code — migrations and functions

This is the part people skip. Your schema and your edge functions should ship in the *same* pull request as the code that needs them. Not "merge the code today, run the migration by hand tomorrow." Together.

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

Why `--include-all`? There's a good note in the file's own comment. With parallel feature branches — and the AI opens several — you get **interleaved migration timestamps.** A branch whose migration sorts *before* one that's already been applied fails with *"Found local migration files to be inserted before…"* unless you tell it to include everything. And `db push` is idempotent — it only applies versions the project hasn't recorded yet — so re-runs are safe.

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

Worth pulling this one out, because the pipeline isn't just quality control — it's a security control too.

Same rule as [the vibe-coding post](/posts/vibe-coding-with-confidence/): anything prefixed `VITE_` is **public** — it ships to the browser, so treat it as visible to the world. That's why the CI build can use placeholder `VITE_` values; they were never secret. Real secrets — a `service_role` key, the `ANTHROPIC_API_KEY` — only ever exist as **Actions secrets**, injected for a few seconds at deploy time, never committed.

So the pipeline is where "don't commit secrets" stops being a note-to-self and becomes structural. The build proves you didn't need the real secret to build it. The deploy is the one place the real one shows up, and only for as long as it takes to use it.

## The payoff — an AI ships through the same gate

`claude-feature.yml`. This is the one the rest was built for.

I drag a card, the issue gets labeled `approved-for-work`, and this workflow runs Claude Code. It builds on a `feature/issue-N` branch and **opens a pull request.** It cannot push to `main`. Same lane as a human — prove it on a branch, open the question, a person reviews, the merge lane ships it. From the file's own header:

> *"the agent works on a branch and opens a PR — it cannot push to main … A human reviews and the board's merge lane ships it."*

Two things in this file are worth a look.

**First — what does "green" even mean?** Not "the agent didn't crash." It means "a pull request exists." Those aren't the same thing, so the workflow checks the real one first:

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

**Second, the one I like most — run your gate even when the platform won't run it for you.** GitHub has an anti-recursion rule: pull requests opened by a bot don't trigger `pull_request` workflows. So the AI's PR wouldn't get the normal four checks on its own. This workflow runs them itself, against the branch:

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

That's the whole idea: don't let code skip the gate because of who — or what — wrote it. GitHub gives the bot a pass; I take it back. Human or AI, same checks.

> NOTE: There's a sixth file I'll only mention — `update-readme.yml` regenerates the README on every merge and commits it back with `[skip ci]`. It's a small example of building an automated loop *without* an infinite one — four independent guards keep it from triggering itself. Good reading if you're wiring up a self-updating job.

## Wrapping up

So that's the pipeline. Five files you can read on one screen:

- **`ci.yml`** — the gate. The same four commands as my local Definition of Done, just un-skippable.
- **`railway.json`** — merge is the deploy. No button.
- **`supabase-migrations.yml`** — schema ships with the code that needs it, idempotently.
- **`supabase-functions.yml`** — functions and secrets as code; the key never lives in git.
- **`claude-feature.yml`** — the AI ships through the exact same gate, and re-runs it when the platform won't.

The reason I can let an AI open pull requests here isn't that the AI is smart. It's that it has to walk through the same green gate I do — and that gate is a handful of files I can read.

Want a place to start? Grab the [supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template, spin up a project, and open `.github/workflows/ci.yml`. Break a check on purpose — one line — push it, and watch the merge go red. Red is the system working. Then fix it, watch it go green, merge, and see the site update on its own. That loop, on your own repo, is the best way to get why this matters.

Green means ship.
