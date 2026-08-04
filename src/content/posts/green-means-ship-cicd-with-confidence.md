---
title: "Green Means Ship: The CI/CD That Lets a Vibe-Coded App (and an AI) Deploy With Confidence"
date: 2026-08-02
excerpt: "In this repo an AI opens its own pull requests, and the pipeline decides whether they ship — typecheck, lint, test, build, then merge to trunk and deploy, with nobody at a button. This is a look at that CI/CD setup: five small files, all hands-off, running a process the industry has trusted for twenty years."
image: "/images/green-means-ship-cicd-with-confidence/cover.png"
tags: [ai, ci-cd, vibe-coding, security, railway, supabase, automation]
draft: true
faq:
  - question: "What does CI/CD actually do for a small app?"
    answer: "It turns the question is this safe to ship into a yes or no that a machine answers. On every pull request it runs the same checks you would run locally — typecheck, lint, test, build — and it blocks the merge if any of them fail. Once they pass and you merge, the deploy happens on its own."
  - question: "Do I need a separate deploy step in my pipeline?"
    answer: "Often no. If your host watches your main branch, merging is the deploy. In this setup Railway redeploys on every push to main, so there is no deploy button in the pipeline at all. The pipeline's only job is to keep main green, and the host handles the rest."
  - question: "Is there a separate production branch?"
    answer: "No. Main is the trunk and the trunk is production. A change lives on a short-lived branch just long enough to pass its checks, then merges back into main, and that merge is what deploys. This is trunk-based development, the model from the Continuous Delivery book."
  - question: "How do database migrations fit into CI/CD?"
    answer: "Ship the migration in the same pull request as the code that needs it. A GitHub Action runs the migration on push to main so the schema change and the code land together. Use an idempotent push that only applies versions the project has not recorded yet, so re-runs are safe and parallel branches with interleaved timestamps do not break each other."
  - question: "How do I keep API keys out of the repo when the pipeline needs them?"
    answer: "Store them as GitHub Actions secrets and have the workflow inject them at deploy time. In this setup the Anthropic key lives as an Actions secret and gets written into Supabase Vault on the project during the functions deploy. It exists in the run for a few seconds and never gets committed. Anything prefixed VITE_ is public by design; real secrets are never that."
  - question: "How can it be safe to let an AI push code to a repo?"
    answer: "The AI does not push to trunk directly. It works on a short-lived branch and opens a pull request, and that pull request has to pass the same checks any change does — typecheck, lint, test, build — before it can merge. Because bot-opened pull requests do not trigger those checks automatically, the workflow re-runs them itself against the branch, so nothing ships based on who wrote it."
---

> **TLDR:** In this repo an AI opens its own GitHub pull requests, and the pipeline decides whether they ship — typecheck, lint, test, build, then merge to trunk and redeploy, with nobody at a button and nobody logged into a server. It's all hands-off: the code, the database migration, the edge functions, the secrets. This is a walk through that pipeline — five small files you can read — from my [supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) template.

👉 **The repo:** [alnutile/supbse-vibecoding-starter](https://github.com/alnutile/supbse-vibecoding-starter) — the starter I clone when I begin something new. It comes with Supabase auth, RLS, realtime, storage, and this CI/CD wiring already set up, so I'm not rebuilding the plumbing every time.

---

In this repo, an AI opens a GitHub pull request. The pipeline runs its checks against it — typecheck, lint, test, build — and if they all pass, it merges to `main` and the site redeploys. Nobody hits a deploy button. Nobody logs into a server.

That works because the thing deciding whether code ships is the pipeline, not a person reading the diff and deciding it looks alright. And this pipeline isn't a new idea. Teams have run some version of it for twenty years — Jenkins, Hudson, CruiseControl before it. What's changed is that the same process now does its job whether a human or an AI wrote the code. The code doesn't get a softer set of rules for being written by Claude.

I wrote [Vibe Coding With Confidence](/posts/vibe-coding-with-confidence/) a while back about getting a vibe-coded app secure, hosted, and online. This is the process running underneath that. It comes straight out of a book I'd point anyone at — *Continuous Delivery* by Jez Humble and David Farley — and the core of it is one sentence: every change goes through the same automated pipeline, and `main` stays in a shippable state at all times. Hold that, and releasing stops being an event you schedule and becomes something that happens on merge.

Let's break it down. It's five small files.

## `main` is trunk, and trunk is production

First thing to get straight: there's no production branch. `main` is the trunk, and the trunk *is* production. A change lives on a short-lived branch just long enough to prove itself, then merges back into `main` — and merging into `main` is what puts it live.

```
short-lived branch  ──PR──►  main (trunk)  ──merge──►  live
```

That's trunk-based development, and it isn't a style preference. The DORA research — the DevOps Research and Assessment program behind the *Accelerate* book — found that integrating into trunk frequently, on short-lived branches, is one of the practices that separates high-performing teams from the rest. The longer a branch sits off on its own, the further trunk drifts out from under it, and the more your green checks are describing a version of the codebase that doesn't exist anymore.

So the rule is a boring one: small changes, merged often, straight back into the trunk everything deploys from.

## The gate — `ci.yml`

[`.github/workflows/ci.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/ci.yml) is the file doing the checking. It runs on every pull request and every push to `main`, and it does four things.

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

Typecheck, lint, test, build. Those four are the same commands as my local Definition of Done — the ones in [`CLAUDE.md`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/CLAUDE.md) that I run before I call anything finished:

```
npm run typecheck && npm run lint && npm test && npm run build
```

So there's one definition of "good," and it reads the same on my laptop and in CI. The difference is that CI runs it every single time — on the changes I wrote and the changes Claude wrote — without anyone deciding to.

> NOTE: The `env` block on the build catches people out. The build needs those Supabase vars to exist, not to be real, so they're public placeholders. Real secrets never go near a CI log — there's a section on that below.

## Small changes are the actual trick

The pipeline only helps if the changes going through it stay small, and this is the most evidence-backed idea in the whole post. *Accelerate* (Nicole Forsgren, Jez Humble, Gene Kim) lays out the DORA data on it: small batch sizes and short-lived branches line up with teams that ship *more* often and break things *less*. It isn't a trade-off. A small change is easier for the pipeline to check and easier to reason about when something does go sideways.

You can make the checks a hard requirement with branch protection on `main` — GitHub will refuse the merge until CI is green. Honestly, I don't lean on that much. Once the checks pass, I let it merge, including when Claude opened it. The thing I trust is the pipeline, not a human signing off at the end. If the checks are green, the change earned its way in — whoever wrote it.

## Merge is the deploy — `railway.json`

There's almost nothing in [`railway.json`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/railway.json), which is the point. Railway watches `main` and redeploys on every push to it. No deploy step lives anywhere in the pipeline — the host is doing it.

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build":  { "builder": "NIXPACKS", "buildCommand": "npm run build" },
  "deploy": { "startCommand": "npm start", "restartPolicyType": "ON_FAILURE", "restartPolicyMaxRetries": 10 }
}
```

[`DEPLOY.md`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/DEPLOY.md) says it in one line: *"Every push to `main` redeploys automatically."* HTTPS is on out of the box. Merge, and the site updates. That's continuous *delivery* in the literal sense — the pipeline carries a change all the way to production with nobody steering it.

And because a deploy is this cheap and this fast, a bad change stops being a crisis. One of DORA's four key measures is how quickly you can restore service, and when shipping is one merge, the quickest fix is usually to roll *forward* — commit the correction and let the same pipeline carry it out — rather than an elaborate rollback. The speed is the safety.

One honest gotcha, because it's never quite this clean the first time: a completely green build still threw 503s and 403s on Railway. Nothing wrong with the code. Astro's preview server (Vite under the hood) rejects a host it doesn't recognize, and Railway's domain wasn't on the list. One line:

```ts
// vite.config.ts
preview: { allowedHosts: ['.up.railway.app'] }
```

That's the part of CI/CD nobody draws in the diagram — the host-config gotcha wedged between "build went green" and "the page actually loads." I pasted the 503 into Claude and it took me straight to that line.

## The schema and the functions ship with the code

Here's what makes it genuinely hands-off: the database migration and the edge functions go out in the same merge as the code that needs them. I'm not SSHing anywhere to run a migration by hand, and I'm not clicking through a dashboard to deploy a function. It's all in the repo, and merging is what applies it.

[`supabase-migrations.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/supabase-migrations.yml) handles the schema. It fires on a push to `main` that touches `supabase/migrations/**` and runs a single command:

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

Why `--include-all`? The file's own comment explains it, and it's a real one. When several branches are open at once — and the AI opens several — their migrations pick up interleaved timestamps. A branch whose migration sorts *before* one that's already applied will fail with `Found local migration files to be inserted before…` unless you tell the push to include everything. And `db push` is idempotent: it only applies versions the project hasn't recorded yet, so running it a second time is a no-op, not a catastrophe.

[`supabase-functions.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/supabase-functions.yml) handles the edge functions. On a push touching `supabase/functions/**`, it deploys the function and, in the same run, writes the API key onto the Supabase project:

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

The key lands in **Supabase Vault** — Supabase's encrypted store built for exactly this — and never in the repo.

## The pipeline is a security control, too

Same rule as [the vibe-coding post](/posts/vibe-coding-with-confidence/): anything named `VITE_` is public. It ships into the browser, so treat it as visible to the entire world. That's why CI can build with placeholder `VITE_` values — they were never secret to begin with. The real secrets — a `service_role` key, the `ANTHROPIC_API_KEY` — live as GitHub Actions secrets, get handed to a deploy for the few seconds it needs them, and land in Supabase Vault on the project side. None of them ever sits in the repo.

So "don't commit your secrets" isn't a rule I have to keep remembering — the pipeline is built so the secret has nowhere to leak. The build proves the app compiles without the real key. The deploy is the only place that key ever shows up.

## The same gate, for the AI — `claude-feature.yml`

Everything above runs the same whether I wrote the code or Claude did, and [`claude-feature.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/claude-feature.yml) is where that gets tested for real. An issue gets an `approved-for-work` label, this workflow runs Claude Code, and it builds on a short-lived `feature/issue-N` branch and opens a pull request. It cannot push to `main`. Its PR faces the same checks any of mine would. From the file's own header:

> *"the agent works on a branch and opens a PR — it cannot push to main … A human reviews and the board's merge lane ships it."*

Two things in here are worth pointing at.

The first is a definition question: what does it mean for that run to have succeeded? Not "the agent didn't crash." What I want is a pull request sitting there. So the check looks for the PR itself, first thing:

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

An agent that runs clean and produces nothing hasn't done the job, so the check is written against the thing I actually wanted.

The second one I find genuinely interesting. GitHub has an anti-recursion rule: a pull request opened by a bot doesn't trigger `pull_request` workflows. It's a sensible default — it stops automation from setting itself off in a loop. But it also means Claude's PR wouldn't get the four checks run against it. So the workflow runs them itself, against the branch it just pushed:

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

The platform handed the bot a free pass, and the workflow hands it back. That's the whole thing in one step: nothing ships without going through the checks, no matter who — or what — wrote it. The trust is in the pipeline, not in whose name is on the commit.

> NOTE: There's a sixth file I'll just point at, [`update-readme.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/update-readme.yml). It regenerates the README on every merge and commits it back with `[skip ci]`. It's a tidy little study in building an automated loop that doesn't set itself off forever — four separate guards keep it from re-triggering. Worth a read if you're wiring up anything that commits back to its own repo.

## So, five files

That's the pipeline, and it really does fit on one screen:

- [`ci.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/ci.yml) — the gate. My Definition of Done, run every time, on everyone's code.
- [`railway.json`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/railway.json) — merge is the deploy, no button.
- [`supabase-migrations.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/supabase-migrations.yml) — the schema ships with the code that needs it, and re-runs safely.
- [`supabase-functions.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/supabase-functions.yml) — functions and secrets as code, the key in Vault, never in git.
- [`claude-feature.yml`](https://github.com/alnutile/supbse-vibecoding-starter/blob/main/.github/workflows/claude-feature.yml) — the AI goes through the same gate, and re-runs it when GitHub won't.

Letting an AI open pull requests here has nothing to do with how smart the model is. Every change it makes goes through the same pipeline mine do, and that pipeline is five small files I can sit and read. CI/CD has been the answer to "is this safe to ship?" for twenty years. It turns out the answer holds up fine when the author is a machine.

## Further reading

None of this is my invention — it's a lot of well-trodden ground, and the people who mapped it wrote it all down:

- **[*Continuous Delivery*](https://continuousdelivery.com/) — Jez Humble & David Farley.** The book this whole setup comes from: trunk-based, always-releasable `main`, every change through one pipeline.
- **[*Accelerate*](https://itrevolution.com/product/accelerate/) — Nicole Forsgren, Jez Humble, Gene Kim.** The research behind small batches, short-lived branches, and the four metrics worth measuring.
- **[dora.dev](https://dora.dev/)** — the DevOps Research and Assessment project itself, free to read. Start with the four keys and the capabilities behind them.
- **[*The Lean Startup*](http://theleanstartup.com/) — Eric Ries.** Build, measure, learn — the reason you want to ship small and often in the first place.
- **[Dave Farley's Continuous Delivery channel](https://www.youtube.com/@ContinuousDelivery)** — if you'd rather watch than read.

Green means ship.
