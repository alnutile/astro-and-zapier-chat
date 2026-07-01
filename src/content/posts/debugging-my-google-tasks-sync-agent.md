---
title: "The Silent Crash: Debugging My Google Tasks Sync Agent"
date: 2026-06-28
excerpt: "The gory trail behind the finale of my vibe-coding build — a per-user Zapier SDK agent that syncs Google Tasks into Supabase. Partial-index upserts, a crash with no error, and a scopes default I missed."
image: "/images/debugging-my-google-tasks-sync-agent/cover.png"
tags: [ai, vibe-coding, zapier, supabase, debugging]
faq:
  - question: "Why did my Node script crash on the host with no error message?"
    answer: "Two common causes: calling process.exit() truncates buffered stdout/stderr before it flushes, so your logged error vanishes — prefer process.exitCode = 1 and let the event loop drain. And a total silence with no stack is often a hard kill (SIGKILL, e.g. out-of-memory), which no try/catch can catch — add synchronous logging with fs.writeSync so checkpoints survive an instant kill."
  - question: "Why can't Supabase (PostgREST) upsert onto a partial unique index?"
    answer: "PostgREST's .upsert() emits ON CONFLICT (cols) with no WHERE clause, so Postgres can't match a partial index that has a WHERE predicate and errors with 'no unique or exclusion constraint matching the ON CONFLICT specification.' Wrap the upsert in a SQL function that includes the matching predicate, and grant execute on it to service_role only."
  - question: "Why does a Zapier SDK action return 'Request denied by policy: can_execute'?"
    answer: "The client credentials likely have no execute scope. The CLI's create-client-credentials defaults --allowed-scopes to empty, while the SDK's programmatic createClientCredentials defaults to ['external']. Recreate the credentials with --allowed-scopes external and update your env vars. A tell-tale sign: lightweight metadata/list actions succeed while actions that actually execute get denied."
---

> **TLDR:** This is the deep-dive behind the finale of [Vibe Coding With Confidence](/posts/vibe-coding-with-confidence/) — the per-user agent that syncs my Google Tasks into the app's Supabase `todos` table via the Zapier SDK, deployed as a second Railway service. The build was mostly boring (good!). The *debugging* is where it got interesting: a partial-index upsert that Supabase won't do, a crash that printed no error at all, and a permissions default I'd quietly missed. Here's the whole trail.

👉 This is the companion to [Vibe Coding With Confidence](/posts/vibe-coding-with-confidence/). If you just want the story, read that one — this is for folks who want the gory details.

---

I'm no expert here — just sharing what actually happened, curveballs and all. The main post keeps it breezy on purpose; this one is where I open the hood.

## What I set out to build

A **separate, server-side agent** — not part of the web app — that:

- reads *my* Google Tasks through the Zapier SDK,
- upserts them into `todos` so a task I add on my phone shows up on the board,
- runs on an hourly cron, and can be run by hand for a demo.

Two rules I held to (straight from the project's `CLAUDE.md`):

- **One agent per user.** No shared multi-tenant bot — each person runs their own instance with their own target user id and their own Google connection.
- **`service_role` is server-only.** The agent writes with Supabase's `service_role` key (which bypasses RLS), so it has to set `user_id` explicitly on every row. That key never touches the browser, a `VITE_` var, or git.

## The database bit (and the first gotcha)

The migration is small — a nullable column plus a partial unique index so re-runs don't create duplicates:

```sql
-- Nullable so existing rows stay untouched.
alter table public.todos add column external_id text;

-- One row per (user, external source id). Partial: existing NULLs unaffected.
create unique index todos_user_external_id_key
  on public.todos (user_id, external_id)
  where external_id is not null;
```

**Gotcha #1 — Supabase's `.upsert()` can't target a *partial* unique index.** PostgREST emits `ON CONFLICT (user_id, external_id)` with no `WHERE`, so Postgres can't match a partial index and throws *"no unique or exclusion constraint matching the ON CONFLICT specification."*

The fix is a small SQL function that does the conflict resolution *with* the matching predicate — and is only executable by `service_role`:

```sql
create function public.sync_external_todos(p_user_id uuid, p_tasks jsonb)
returns integer language plpgsql set search_path = '' as $$
begin
  insert into public.todos (user_id, external_id, title, status)
  select p_user_id, e->>'external_id', e->>'title', (e->>'status')::public.todo_status
  from jsonb_array_elements(p_tasks) as e
  where coalesce(e->>'external_id','') <> '' and coalesce(e->>'title','') <> ''
  on conflict (user_id, external_id) where external_id is not null
  do update set title = excluded.title, status = excluded.status, updated_at = now();
  -- ...return the count...
end $$;

revoke execute on function public.sync_external_todos(uuid, jsonb) from public, anon, authenticated;
grant  execute on function public.sync_external_todos(uuid, jsonb) to service_role;
```

I checked it was idempotent *before* writing any agent code: two runs with the same `external_id` → **one row, updated (not duplicated).** Prove the boring part works first.

## The agent

I discovered the Zapier action keys with the CLI instead of guessing them:

```
zapier-sdk list-actions GoogleTasksCLIAPI
# -> list_task_lists (read), get_tasks_by_list (search, with show_completed)
```

Then the flow is: read every task list → read tasks per list (including completed) → map `needsAction → backlog` and `completed → done` → dedupe by Google Task id → cap to the latest 50 → one `sync_external_todos` call.

### One folder per agent

```
agents/
  README.md              # the convention
  google-tasks-sync/     # this agent: package.json, sync.ts, railway.json, …
```

Named by **source** (`google-tasks-sync`), not destination — every agent feeds the same `todos` table, so the *source* is what tells them apart. Each folder is its own Railway service (Root Directory = that folder) with an hourly cron.

## Then I tried to deploy, and the fun began

### Bug A — the *web app* build broke on Railway

Setting up the SDK had installed the Zapier packages into the **web app's** root `package.json`. That surfaced two failures in Railway's build:

```
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json ... are in sync.
npm error Missing: @types/react@19.2.17 from lock file
```

…plus Nixpacks defaulting to **Node 18** (Supabase wants ≥ 20).

Root cause: the Zapier **CLI** uses `ink` (a React-based terminal UI), which dragged `@types/react@19` in transitively and desynced the lockfile — in an app pinned to React 18.

**Fix:** the web app shouldn't carry agent deps at all. I stripped `@zapier/*`, `tsx`, and `@types/node` out of the web root, regenerated a clean lockfile, and pinned Node with `engines` + `.nvmrc`. Then I verified by running the *exact* Railway steps locally: `npm ci` then `npm run build` — both green.

> Lesson: keep a sub-component's dependencies in the sub-component. A CLI tool sitting in your web app's `devDependencies` can quietly poison the lockfile and break an unrelated deploy.

### Bug B — the agent "crashed" with no error

This one was sneaky. The Railway deploy log, in full:

```
Starting Container
Found 22 Google Tasks list(s).
```

…then "crashed." No stack trace. No message. Nothing.

**Hypothesis 1: the error is being swallowed on exit.** My `catch` called `process.exit(1)` — and `process.exit()` truncates buffered stdout/stderr before it flushes, so a logged error can just vanish. I swapped it for `process.exitCode = 1` (let the event loop drain) and wrapped each list read in its own `try/catch` so one bad list couldn't abort the whole run.

Redeployed. **Same truncation point. Still no error.**

**Hypothesis 2: it's being hard-killed (SIGKILL), so nothing JS-level runs.** A `try/catch` can't catch a kill; buffered logs die with the process. Classic suspect: out-of-memory. So I made the diagnostics bulletproof:

- **Synchronous logging** via `fs.writeSync(1, …)` — survives an instant kill, unlike async `console.log` to a pipe.
- **Per-list progress + an RSS memory readout**, to see how far it got and whether memory was climbing.
- **`unhandledRejection` / `uncaughtException` handlers** that log synchronously, in case the SDK floated a rejection.

I couldn't reproduce on Railway quickly, so I reproduced the *auth path* locally — and the real error finally surfaced:

```
ZapierApprovalError: Request denied by policy: can_execute on
action/GoogleTasksCLIAPI@latest/read/list_task_lists
```

Not OOM. Not memory. A **scopes/policy denial.**

## The root cause

The agent's server credentials had been created with the CLI's `create-client-credentials`, whose `--allowed-scopes` **defaults to `[]` (empty)**. The SDK's programmatic `createClientCredentials`, by contrast, defaults to **`["external"]`** — the scope that permits executing actions on the user's behalf.

So the credentials had **no execute scope.** And the tell was subtle:

- `list_task_lists` — a lightweight metadata/dropdown action — was **allowed** (that's why the log got as far as "Found 22 lists"), but
- `get_tasks_by_list` — which actually **executes** a search — was **denied** on `can_execute`.

This one was on me. The SDK gives you fine-grained control over exactly what a credential is allowed to do — which is genuinely a good security posture — I just hadn't set the scope, and the CLI's default happens to differ from the SDK's. Two front doors, two defaults.

## The fix

Recreate the credentials **with the scope**, then update the Railway env vars:

```bash
npx -p @zapier/zapier-sdk-cli zapier-sdk \
  create-client-credentials "todo-sync-agent" --allowed-scopes external --json
# -> update ZAPIER_CREDENTIALS_CLIENT_ID / ZAPIER_CREDENTIALS_CLIENT_SECRET
```

And I made the agent **fail loud**: if every list comes back denied, it now prints that exact command instead of silently syncing nothing.

## Lessons worth stealing

1. **`process.exit()` eats your logs.** It truncates buffered stdout/stderr. In a short-lived job, prefer `process.exitCode = 1` and let the process drain — or log synchronously with `fs.writeSync` when you *must* see it.
2. **A silent crash with no stack is usually a hard kill.** Add synchronous checkpoints and a memory readout before you assume it's your logic.
3. **Make batch jobs resilient and loud.** One bad item shouldn't abort the batch; and "did nothing" should shout *why*, with the fix — not shrug.
4. **CLI defaults ≠ SDK defaults.** Here it was empty scopes vs `["external"]`. When a tool has two front doors, check both defaults.
5. **Metadata calls succeeding ≠ auth is fine.** A dropdown/list call passing can mask that *executing* actions is denied. Test the real action early.
6. **Keep sub-component deps out of the web app.** A CLI's transitive React types desynced a React-18 lockfile and broke an unrelated deploy.
7. **Pin your Node version for the platform.** Nixpacks defaulted to Node 18; `engines` + `.nvmrc` fixed it.
8. **Security stayed boring on purpose.** `service_role` server-only, RLS intact, the agent sets `user_id` explicitly, and the upsert function is granted to `service_role` alone. The exciting bug was operational, not a data leak — which is exactly how you want it.

## Timeline

| Commit  | What |
|---------|------|
| `b0565fa` | Step 5: the sync agent + migration (external_id, partial index, RPC) |
| `17a5ad0` | Cap to the latest 50 tasks |
| `03f151c` | Restructure to `agents/google-tasks-sync/`; fix the web app's Railway build |
| `a8d875e` | Correct the Zapier CLI `npx` invocation in the docs |
| `63544a0` | Agent: surface real errors, survive a bad list |
| `85b7e08` | Agent: synchronous crash-proof logging; diagnose the scope denial |

None of it was scary. Every curveball turned out to be a small, boring fix hiding behind a mysterious symptom — which, honestly, is the whole message of the [main post](/posts/vibe-coding-with-confidence/). You don't need to know the answer up front. You just keep making the problem show you more.
