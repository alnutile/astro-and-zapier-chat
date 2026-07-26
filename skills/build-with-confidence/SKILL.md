---
name: build-with-confidence
description: Alfred's playbook for building a real web app the way he likes — from a static page to a database-driven, authenticated app, optionally with its own agent. Use this whenever Alfred wants to build, scaffold, or start a new application, mentions "build me an app", "new project", "start a to-do app", "spin up a site", or is otherwise beginning a build. It gates the whole build on just two questions (static vs database, anonymous vs authenticated) and then applies his stack, security defaults, and hard-won lessons automatically — so it doesn't re-litigate choices already decided here.
---

# Build With Confidence — how Alfred builds applications

This is Alfred's way of building. It is not the only way, and it is not gospel —
it is the set of opinions that consistently works for him, written down so you
build the same way every time without asking him to re-decide.

**Voice, if you narrate:** confident and humble about *method*, not ability.
"There is more than one way to do this; here is what I see working." Never
"the one correct way," never "I'm no expert."

## The rule of engagement — ask two questions, then build

Before you scaffold anything, ask **exactly these two**, then proceed:

1. **Static page, or database-driven?**
2. **If database-driven: anonymous session, or real accounts (authentication)?**

That's it. Everything else below is already decided. If something is genuinely
ambiguous *beyond* these two, **pick the more secure default and flag it** — do
not stop to ask about stack, host, or security posture. Those are settled.

The answers route you to a path:

| Static? | Auth? | Path |
|---------|-------|------|
| Static  | —     | **A — static page** |
| Database | Anonymous | **B — database, anonymous** |
| Database | Authenticated | **C — database, real accounts** |

Then, any path can add the optional **Agent** add-on (sync from an outside system).

## Shared defaults (every path — do not re-ask these)

- **Stack:** Vite + React + TypeScript. (Plain HTML/CSS/JS only if the thing is
  genuinely a one-file static artifact.)
- **Data / auth / realtime:** Supabase.
- **Hosting:** Railway — deploys from GitHub on every push, HTTPS is free.
- **Domain / edge:** Cloudflare (optional, later).
- **Outside integrations / agents:** the Zapier SDK.
- **GitHub** is just where the code lives so the host can grab it. Do the Git
  steps for him; a merge conflict is `git pull --rebase`, not a crisis.

### Non-negotiable security (applies to B, C, and agents)

- **Never roll your own auth.** Use Supabase Auth.
- **Row Level Security (RLS) is ON** for every table holding user data.
  Default-deny, then policies gated on `user_id = auth.uid()` for
  select/insert/update/delete. Never ship a user-data table with RLS off — even
  at the anonymous stage.
- **Env var discipline:** only `VITE_`-prefixed values reach the browser — treat
  them as **public**. The Supabase **anon / publishable** key is fine client-side.
  The **`service_role`** key is **server-only**: never in client code, never in a
  `VITE_` var, never committed. `.env` is gitignored; ship a `.env.example` with
  placeholders.
- **HTTPS only** (Railway gives it — don't undo it).

### Deploy (every path)

- Push to GitHub → Railway builds on push. First time: new project → pick repo →
  deploy. Set any `VITE_` vars in the Railway service. Confirm HTTPS.
- Pin Node with `engines` + `.nvmrc` so the host doesn't default to something old.

## Path A — static page

- Vite + React + TS (or a single HTML file if truly trivial). Use `localStorage`
  if it needs to remember anything. No backend, no secrets.
- Serve the built `dist/` on `$PORT` (e.g. `vite preview --host 0.0.0.0 --port $PORT`).
- **Done when:** it builds and deploys over HTTPS.

## Path B — database-driven, anonymous

- Supabase **anonymous auth** (an automatic session, no login UI yet).
- Data model, e.g. a `todos`-style table: `id`, `user_id` (default `auth.uid()`),
  the domain fields, a `status` enum if it's a board, `position` for ordering,
  `created_at`, `updated_at`.
- **RLS ON now**, policies gated on `user_id = auth.uid()` for all four ops.
- Use **Supabase Realtime (websockets)** when cross-tab / live sync matters.
- **Done when:** an incognito window can't see another session's rows; realtime
  syncs across two tabs; no secrets in the client bundle or git.

## Path C — database-driven, real accounts

Everything in Path B, plus:

- **Real accounts:** open registration + **magic-link** sign-in, no email
  verification required (note in the README it can be tightened later). **Remove
  the anonymous auth** once real auth is in.
- **Gate the app:** unauthenticated users see the login screen, not the app. Add
  a visible **Sign out**.
- **The magic-link gotcha:** set Supabase Auth **Site URL** and **Redirect URLs**
  to BOTH the local dev URL and the deployed domain, or links break in one env.
- **Done when:** register + log in (password *and* magic link), a user sees only
  their own data, sign out works, and an incognito window is bounced to login.

## Optional add-on — give the app its own agent (Zapier SDK)

When he wants the app to sync from a system he already uses (Google Tasks, etc.):

- Put it in its **own** subfolder `agents/<source-name>/` (named by source), as a
  **separate Railway service** on an hourly cron (runnable by hand for a demo).
  Many agents can live under `agents/`.
- Use the **Zapier SDK** with **his own connection**. **Discover the action keys
  with the CLI** (`zapier-sdk list-actions <appKey>`) — don't guess them. He'll
  hand you the connection ID.
- **Dedupe by `external_id`:** nullable `external_id` column + a **partial unique
  index** `(user_id, external_id) WHERE external_id IS NOT NULL`. PostgREST's
  `.upsert()` can't target a partial index, so do the upsert inside a SQL function
  that includes the `WHERE` predicate, and `grant execute` on it to
  **`service_role` only**.
- **One agent per user.** It runs server-side with the `service_role` key (from a
  Railway env var), and because that bypasses RLS it must **set `user_id`
  explicitly** on every row.
- **Credential scope gotcha:** create client credentials with
  `--allowed-scopes external` — the CLI defaults to *empty* scopes, which lets
  metadata/list calls through but **denies executing** the real action.

## Hard-won lessons (bake these in — don't relearn them)

- **`process.exit()` truncates logs.** In a short-lived job prefer
  `process.exitCode = 1` and let it drain, or log synchronously with `fs.writeSync`.
- **A silent crash with no stack is usually a hard kill** (OOM). Add synchronous
  checkpoints before theorizing it's your logic.
- **A metadata call passing ≠ auth is fine** — test the real action early.
- **Keep a sub-component's dependencies in the sub-component.** A CLI tool in the
  web app's `devDependencies` can desync the lockfile and break an unrelated deploy.
- **Make batch jobs resilient and loud:** one bad item shouldn't abort the batch,
  and "did nothing" should say *why*.

## How to work with him

- Apply these defaults automatically. Prefer the **simplest thing that is still
  secure**.
- Ask only the two gating questions. Beyond those, choose the safer option and
  flag it rather than stopping.
- Start simple and layer security in as complexity grows — that's the whole idea:
  build with confidence.
