---
title: "Green Means Ship: The CI/CD That Lets a Vibe-Coded App (and an AI) Deploy With Confidence"
date: 2026-08-02
excerpt: "One of my repos has an AI open its own pull requests. I'm fine with that, because none of them can merge until the checks are green — the same four checks I have to pass. Here's the whole pipeline, five small files you can read."
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

> **TLDR:** One of my repos has an AI open its own pull requests. I'm fine with that, because none of them can merge until the checks pass — the same typecheck, lint, test, build I have to pass. Once they're green and it's merged, the deploy happens on its own. This is a walk through that pipeline: five small files you can read, from my [supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template.

👉 **The repo:** [alnutile/supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) — the starter I clone when I begin something new. It comes with Supabase auth, RLS, realtime, storage, and this CI/CD wiring already set up, so I'm not rebuilding the plumbing every time.

---

I drag a card on a board, and a while later there's a pull request waiting for me. I didn't write it — Claude did. It made a branch, wrote the code, ran the build, and opened the PR, and now it's sitting there with its checks either green or red, same as any PR I'd open myself.

And I'm fine with it. The AI hasn't earned some special trust from me — it just can't merge that PR until the checks pass, and the checks are a real list of things that either worked or they didn't. If Claude writes something broken, it gets stopped in the same place I would.

I wrote [Vibe Coding With Confidence](/posts/vibe-coding-with-confidence/) a while back about getting a vibe-coded app secure, hosted, and online. This is the machinery running under all of that. AI writes more of my code every month, and the bottleneck moved. Writing the code is the fast part now; trusting it is what takes the time. Reading it more carefully doesn't get me there, so I made the trust mechanical instead — something a machine runs on every change, that refuses anything red.

That's really all CI/CD is. No big platform, no 40-step Jenkins file. Every step in the process has a gate, and the gate is code you can read. Let's break it down.

## The three lanes

Before any YAML, here's the whole shape:

```
feature branch  ──PR──►  main  ──merge──►  production
```

A feature branch is cheap — make a mess on it, nobody cares. The PR off it asks one question: is this safe to ship? On `main`, the answer is always yes, because nothing red ever gets in, which is what keeps `main` a branch you could deploy at any second. Production happens when you merge; there's no separate step to go run.

None of that comes from one clever tool. It comes from "is this safe?" going from a judgment call I'd make squinting at a diff to a status check anyone can glance at.

## The gate — `ci.yml`

This is the file doing the gatekeeping. It runs on every pull request and every push to `main`, and it does four things.

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

Typecheck, lint, test, build. Those four are the same commands as my local Definition of Done — the ones sitting in `CLAUDE.md` that I run before I call anything finished:

```
npm run typecheck && npm run lint && npm test && npm run build
```

So "works on my machine" and "passes CI" come down to the same command list. The only difference is CI runs it whether or not I remember to, on the night I'm tired and just want to merge and go to bed.

> NOTE: The `env` block on the build catches people out. The build needs those Supabase vars to exist, not to be real, so they're public placeholders. Real secrets never go near a CI log — there's a whole section on that below.

## Small branches, and a switch that makes the check mandatory

This only holds up if the branches stay small, which is easy to say and easy to let slide — especially with the AI opening several branches at once. (That habit is exactly what sets up the migration mess I'll get to in a bit.) Short branches, merged often, keep the checks honest.

One setting makes the check non-optional: branch protection on `main`, set to require CI before a merge goes through. Leave it off and CI is a suggestion, and a suggestion is something a hurried human — or an eager agent — clicks right past.

## Merge = deploy — `railway.json`

There's almost nothing in this one, which is the whole point. Railway deploys from GitHub on every push to `main`. No deploy step lives in the pipeline — the host is watching the branch itself.

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build":  { "builder": "NIXPACKS", "buildCommand": "npm run build" },
  "deploy": { "startCommand": "npm start", "restartPolicyType": "ON_FAILURE", "restartPolicyMaxRetries": 10 }
}
```

My `DEPLOY.md` puts it in one line: *"Every push to `main` redeploys automatically."* HTTPS is on out of the box. So I merge, walk away, and the site updates. I'm not the person standing over a deploy button at 11pm anymore.

It's never quite that clean the very first time, though. Here's the one that got me: a completely green build still threw 503s and 403s on Railway. Nothing wrong with the code. Astro's preview server (Vite under the hood) rejects a host it doesn't recognize, and Railway's domain wasn't on the list. One line:

```ts
// vite.config.ts
preview: { allowedHosts: ['.up.railway.app'] }
```

That's the part of CI/CD nobody draws in the diagram — the boring host-config gotcha wedged between "build went green" and "the page actually loads." I pasted the 503 into Claude and it took me straight to that line, which is how most of these go for me now.

## Infra ships with the code — migrations and functions

This is the part that most often gets skipped, and the one I care about most: your schema change and your edge functions belong in the same pull request as the code that needs them. Not "merge the code today, run the migration by hand tomorrow" — they go together or they don't go.

`supabase-migrations.yml` handles the schema. It fires on a push to `main` that touches `supabase/migrations/**` and runs a single command:

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

Why `--include-all`? The file's own comment explains it, and it's the mess I promised you earlier. When several feature branches are open at once — and the AI cheerfully opens several — their migrations pick up interleaved timestamps. A branch whose migration sorts *before* one that's already applied fails with `Found local migration files to be inserted before…` unless you tell the push to include everything. And `db push` is idempotent: it only applies versions the project hasn't recorded yet, so running it a second time is a no-op, not a catastrophe.

`supabase-functions.yml` handles the edge functions. On a push touching `supabase/functions/**`, it deploys the function and, in the same run, sets the API key on the Supabase project from a GitHub Actions secret:

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

The key never lands in the repo. It lives as a GitHub Actions secret, gets set on the project during the deploy, and that's the whole trip.

## The security the pipeline is quietly doing

That last bit earns its own section, because there's a security rule baked into the pipeline, not only a quality one.

Same rule as [the vibe-coding post](/posts/vibe-coding-with-confidence/): anything named `VITE_` is public. It gets shipped into the browser, so treat it as visible to the entire world. That's why CI can build with placeholder `VITE_` values — they were never secret to begin with. The real secrets, a `service_role` key or the `ANTHROPIC_API_KEY`, only ever exist as Actions secrets, handed to a deploy for the few seconds it needs them, and never committed.

So "don't commit your secrets" isn't advice I have to keep remembering — the pipeline is built so I can't. The build proves the app compiles without the real key. The deploy is the only place that key ever appears, and only for as long as it takes to use it.

## An AI ships through the same gate — `claude-feature.yml`

Back to that PR Claude opened. This is the file behind it.

I drag a card, the issue gets an `approved-for-work` label, and this workflow runs Claude Code. It builds on a `feature/issue-N` branch and opens a PR. It cannot push to `main` — same lane as me. Prove it on a branch, open the question, a human reviews, the merge lane ships it. The file says so right at the top:

> *"the agent works on a branch and opens a PR — it cannot push to main … A human reviews and the board's merge lane ships it."*

Two things in here I want to point at.

The first is a definition question: what counts as the run succeeding? An agent that runs clean but produces nothing hasn't done the job — what I actually want is a PR sitting there for me to review. So the check looks for the PR itself, first thing:

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

The second one I like more. GitHub has an anti-recursion rule: a pull request opened by a bot doesn't trigger `pull_request` workflows. It's a reasonable default — it stops automation from setting itself off in a loop. But it also means Claude's PR wouldn't get the four checks run against it. So the workflow runs them itself, against the branch it just pushed:

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

The platform handed the bot a free pass, and the workflow hands it back. Human or AI, the code meets the same four checks. That's the rule I actually care about here — nothing skips the gate based on who, or what, wrote it.

> NOTE: There's a sixth file I'll just point at, `update-readme.yml`. It regenerates the README on every merge and commits it back with `[skip ci]`. It's a tidy little study in building an automated loop that doesn't set itself off forever — four separate guards keep it from re-triggering. Worth a read if you're wiring up anything that commits back to its own repo.

## So, five files

That's the pipeline, and it really does fit on one screen:

- `ci.yml` — the gate. My local Definition of Done, minus the option to skip it.
- `railway.json` — merge is the deploy, no button.
- `supabase-migrations.yml` — the schema ships with the code that needs it, and re-runs safely.
- `supabase-functions.yml` — functions and secrets as code, the key never in git.
- `claude-feature.yml` — the AI goes through the same gate, and re-runs it when GitHub won't.

Letting an AI open PRs in here has nothing to do with how smart the AI is. It has to walk through the same green gate I do, and that gate is five files I can sit and read.

If you want to see it work, the quickest way is to break it on purpose. Grab the [supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template, spin up a project, open `.github/workflows/ci.yml`, and drop a stray type error into the code. Push it, and the merge goes red. Fix it, and it goes green and deploys itself. Seeing it go red and then green on my own repo is what made it click for me.

Green means ship.
