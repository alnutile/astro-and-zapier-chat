---
title: "Thoughts on using Supabase Edge Functions in SupaNet.io"
date: 2026-07-25
excerpt: "I built SupaNet.io heavily on Supabase edge functions instead of building a backend from scratch. A review from actually shipping on it: what the platform handles, the build pattern that mattered most, and the trade-offs. Not a tutorial."
image: "/images/edge-functions/cover.jpeg"
tags: ["supabase", "edge-functions", "vibe-coding"]
draft: false
faq:
  - question: "What is a Supabase edge function?"
    answer: "A small piece of server code that runs on Supabase's infrastructure instead of a server you manage. Each function is a folder with an entry file, written in TypeScript on a Deno runtime, and once deployed it is served at its own URL. You add an endpoint by adding a folder, not by wiring up more routing and auth."
  - question: "Do Supabase edge functions replace your whole backend?"
    answer: "No. You still write the feature logic, and there is plenty of it. What the platform absorbs is the undifferentiated 60 to 70 percent of a typical backend: routing, auth, authorization, realtime, storage, secrets, and cron. Those become configuration and declarative rules instead of code you own and debug. The app itself is still yours to build."
  - question: "What is Row-Level Security (RLS) and why does it matter?"
    answer: "Row-Level Security is a Postgres feature, not a Supabase one, though Supabase makes it easy to use. You write one rule per table (for example, a row is visible if you own it or it is shared with your workspace) and Postgres applies it like a WHERE clause on every query, from any client. It is default-deny: until you write a policy, the API returns nothing. It matters because authorization moves from checks scattered across every endpoint to a single rule the database enforces, which removes the highest-severity bug class: a missed permission check leaking data."
  - question: "Are you locked into Supabase if you build on edge functions?"
    answer: "Not really. Supabase is open source and self-hostable: Postgres, auth, storage, the edge-functions runtime, and the secrets Vault are all in the open-source stack, and the functions run on any Deno-compatible platform. The real trade is convenience versus control. The hosted platform's managed secrets, one-command deploys, and cron just work, while self-hosting means running that operational layer yourself. Which conveniences carry over changes over time, so check the current docs before depending on it."
  - question: "How do you deploy Supabase edge functions?"
    answer: "You can deploy through the Supabase dashboard, the CLI, or MCP. In my setup deployment runs through GitHub Actions, so shipping a function is automated: I push and the action deploys it. One thing to know is that functions deploy on a separate path from the frontend, so it is its own step rather than riding along with the frontend deploy."
---

Wanted to share some thoughts on Supabase edge functions, since I've leaned on them so heavily building SupaNet.io.

This is a review, not a tutorial. I'm coming at it the way you decide how to build any real multi-tenant app: what to write yourself, what to hand to the platform, where AI fits, and what it costs you later. Here's how that broke down.

## What an edge function is here

An edge function is server code that runs on Supabase's infrastructure instead of a server I run. Each one is a folder with an entry file, TypeScript on a Deno runtime. Deployment runs through GitHub Actions, so shipping a function is automated — push, the action deploys it. You can see the pipeline [here](https://github.com/alnutile/supabase-as-a-service/blob/main/.github/workflows/deploy-functions.yml)

The unit is the folder: one folder, one endpoint. That's the first architectural shift. Routing decisions mostly go away, so the design question moves off "how do I wire up routes and middleware" and onto "how do I organize the shared code sitting behind these folders." More on that below, because that's where the interesting part is.

## Where the time normally goes

Most of a multi-tenant app isn't the feature. It's the same infrastructure every time: auth, authorization, a database and a safe path to it, realtime, file storage, secrets, cron. Call it 60–70% of a typical backend. It's also where the costly mistakes live — authorization especially, where a missed check is a data leak, not a bug that throws.

That's the part I wanted to hand off — not to write faster, to not own at all. Less of my own infrastructure code means less surface for me, or an AI I'm pairing with, to get wrong.

## What the platform handles

Each concern, how I'd normally build it, and what it became on Supabase:

| Concern | Roll-your-own | On Supabase |
| --- | --- | --- |
| **Routing** | Express/Fastify, a route table, a middleware chain, a deploy target | A folder per endpoint. One config line for the auth check. |
| **Auth** | Session store, JWT, resets, magic links, OAuth | Supabase Auth via the client SDK. No login backend. |
| **Authorization** | Per-endpoint permission checks | One Row-Level Security rule per table, enforced by Postgres. |
| **Database access** | ORM, migrations, connection pooling | Auto-generated API; the browser can query the DB directly, gated by RLS. |
| **Realtime** | Websocket server, presence, pub/sub, reconnection | A realtime publication + a client subscribe. Runs chat sync, the multiplayer whiteboard/cards, the activity feed. |
| **File storage** | S3 wiring, signed URLs, access control | Storage buckets + folder-scoped policies. |
| **Secrets** | KMS/Vault integration | Supabase Vault + two small DB functions. |
| **Cron / jobs** | Worker process, scheduler, queue | Postgres cron calling a function on a timer. |

The through-line: most of these stopped being code and became configuration or a single declarative rule.

The line counts track with that. In SupaNet.io the frontend is around 31,000 lines. The whole backend — every function plus shared code — is around 15,600, about a third of the codebase. And inside it, the reused shared modules (~7,900 lines) outweigh all the function entrypoints combined (~7,600). Most of the backend is library code I reuse, not per-endpoint plumbing.


!["Backend"](/images/edge-functions/backend-small-part.png)

## Authorization: one rule instead of many checks

This is the piece that mattered most, so it's worth being precise about what actually changes.

You can do authorization in application code — middleware, per-endpoint checks — and it works. The cost is that every new query path is another place the check has to be repeated, and the failure mode is silent: miss one and data leaks with no error to catch it.

Postgres handles this a level down, with Row-Level Security (RLS). It's a Postgres feature, not a Supabase one — Supabase makes it easy to enable and manage. You write a policy on the table ("a row is visible if you own it or it's shared with your workspace") and Postgres applies it like a `WHERE` clause on every query, from any client. An edge function and the browser hitting the auto-generated API go through the same rule. It's default-deny: enable RLS and the API returns nothing until a policy exists.

So authorization moves from scattered application logic to one declarative rule per table, enforced by the database. That's the strongest reason I'd build this way again — it removes the highest-severity bug class instead of relying on me to be careful across every endpoint.

> NOTE: RLS is per-table and off until you enable it. A table without it is open through the public API, so the order is: create the table, enable RLS, write the policy.


!["Database"](/images/edge-functions/database-bouncer.png)


## The build pattern that mattered: thin functions, shared core

The functions are thin. The logic lives in shared modules every function imports — one that runs a tool, one that screens input for prompt-injection, one that assembles context for the model. Written once, imported everywhere.

That's what makes new surfaces cheap. The same tool code runs from the in-app chat, a webhook, the scheduler, a Slack handler, an event dispatcher, and a loop runner — and it's exposed again to an external AI over MCP, to a REST endpoint, and to a direct tool-runner. One implementation, roughly ten call sites, no divergence. Build the capability once and every surface gets it; build them as separate services and you maintain the same logic in several places and fix each bug several times.

The tell for this style is the shape of the tree: a small `functions/` folder, a large shared-logic folder. When it inverts — functions each re-implementing routing and validation — you're working against the platform. Mine holds except for one function, the MCP server at ~2,200 lines, which is where the discipline broke down.

!["MCP"](/images/edge-functions/mcp.png)

## Trade-offs

None of it is free. The honest costs:

**Platform coupling.** RLS, the Vault, Postgres cron, the management API — none of it moves to a bare server without rework. A deliberate trade, worth making deliberately.

**Two runtimes.** Functions run on Deno, the frontend on Node. Some logic ends up mirrored in both — a parser, some date math — and has to stay in sync. Shared tests are the mitigation.

**Split deploys.** Frontend and functions ship on separate paths; functions go out through their own GitHub Actions step, with an in-app panel as a fallback for when I can't push.

**Platform-specific gotchas.** A few that took real time to work out:

- Default function URLs rewrite HTML responses to plain text (anti-phishing), so serving raw HTML needs a paid custom domain to render.
- Migration files need unique, contiguous numeric prefixes or the deploy is rejected.
- Changing a database function's return type requires dropping it first, and a migration that fails partway isn't recorded as applied — so a later object can go missing in production until you catch it.

These are the cost of the platform doing this much. For this project, worth it.

## Open source and self-hosting

One clarification, because it changes how the coupling reads. Supabase is open source and self-hostable — Postgres, auth, storage, the edge runtime, and the Vault are all in the open-source stack, and the functions run on any Deno-compatible platform. So it isn't lock-in.

But open source isn't turnkey. The hosted platform's managed secrets, one-command deploys, and cron are conveniences; self-hosting means running that operational layer yourself. It's a convenience-versus-control trade, not a locked door. Which conveniences carry over changes over time, so check current docs before depending on it.

## Was it worth it?

Yes, with the caveat that the platform doesn't write the app. The feature logic is still mine, and there's plenty of it. What changed is that the undifferentiated 60–70% — routing, auth, authorization, realtime, storage, secrets, cron — became configuration and declarative rules instead of code I own and debug. The value isn't writing that faster; it's not writing it, and not being able to get it wrong. Mostly that's RLS.

If you're deciding how to build the next multi-tenant thing, that's the case for it. The low-commitment way to test the claim: build one feature that needs auth and a database on Supabase, and see how much of the usual backend you never touch.
