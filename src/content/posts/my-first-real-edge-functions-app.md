---
title: "My First Real Edge Functions App (And What It Actually Saved Me)"
date: 2026-07-25
excerpt: "I built my first app that really leans on Supabase edge functions instead of rolling my own backend. Here's what it actually saved me — and the sharp edges nobody warns you about."
tags: []
draft: true
---

I built my first app that really leans on Supabase edge functions instead of standing up my own backend. Routing, auth, all of it. This is the honest version of what that bought me — not a sales pitch. The stuff Supabase quietly handled, the one pattern that paid off the most, and the places I cut myself along the way.

## First, what an "edge function" even is

If you haven't used them: an edge function is just a small piece of server code that runs close to your users, on demand. You don't manage a server. You don't keep a process running. You drop a folder of code and Supabase hands it a URL.

That's the part that got me. **Each folder *is* a route.** No Express app. No route table. No middleware chain to wire up. I've got about two dozen of these little functions — `chat`, `webhook`, `scheduler`, `mcp`, `run-tool` — and every one is just a folder that turned into a working endpoint.

First time it clicked I actually laughed. All that routing code I've written over the years — gone. It's a directory now.

## The wall I keep hitting

Here's the thing every side project runs into. You have an idea. The idea is the fun part — the chat assistant, the shareable doc, the little tool. That's maybe 30% of the work.

The other 70%? Same boring problems, every single time:

- Auth. Login, sessions, password resets, magic links.
- Who's allowed to see what.
- A database and a safe way to talk to it.
- Realtime updates so two people don't see stale data.
- File storage. Signed URLs.
- Somewhere to keep secrets.
- Background jobs and cron.

Every one of those is a place to introduce a bug. And the two scariest ones — auth and who-can-see-what — are exactly where a mistake stops being a typo and becomes a data leak.

So here's what I actually wanted to know going in: how much of that 70% can I just stop writing?

> 🎨 **IMAGE HERE — "the backend is the small part."**
> A clean, minimal proportional-size diagram (light + dark friendly) comparing three code sizes in this app: **Frontend UI ≈ 31,000 lines** (one big block), **Shared backend logic ≈ 7,900 lines**, **Edge functions ≈ 7,600 lines** (two small blocks next to it). The point of the picture: the actual backend is tiny compared to the app.
> **Generation prompt:** *"Flat minimal vector infographic, light and dark mode friendly, three labeled proportional blocks showing relative code size — one large block 'Frontend UI ~31k lines', two small blocks 'Shared logic ~7.9k' and 'Edge functions ~7.6k'. Caption underneath: 'The backend is the small part.' 2–3 accent colors, lots of whitespace, no clutter."*

## What Supabase just... handled

Let me put it in a table, because seeing it side by side is what made it land for me. Left is how I'd normally build each piece from scratch. Right is what I actually had to write this time.

| The boring-but-critical part | How I'd normally build it | What I actually wrote |
| --- | --- | --- |
| **Routing** | An Express/Fastify app, a route table, a middleware chain, a deploy target to babysit | Nothing. Each folder in `functions/` *is* a route. One line of config is the auth middleware. |
| **Auth** | A session store, JWT issue/verify, password resets, magic links, OAuth flows | Nothing. The browser calls Supabase Auth. I never wrote a login backend. |
| **Who can see what** | Permission checks copy-pasted into every endpoint (miss one = data leak) | A **rule in the database** (Row-Level Security). Written once, enforced everywhere. |
| **Database access** | An ORM, a migration tool, connection pooling | The browser talks to the database directly — safely, because of the rule above. |
| **Realtime** | A websocket server, presence, pub/sub, reconnection logic | Nothing. Flip a table to "realtime," subscribe from the client. |
| **File storage** | S3 wiring, signed URLs, access control | Storage buckets + a folder rule. Signed URLs are one call. |
| **Secrets** | A vault/KMS integration | Supabase Vault + two small functions. |
| **Background jobs / cron** | A worker process, a scheduler, a queue | A bit of database cron poking a function on a timer. |

That right-hand column is the whole story. Look how much of it says "nothing" or "one rule."

### The one that matters most: who can see what

This is the reason I'd do it again.

Normally "who's allowed to see this?" is logic scattered across every endpoint you've got. A check here, a check there. And heaven help you if you forget one, because that's how a single wrong line leaks somebody's private data.

Supabase does it completely differently, with something called **Row-Level Security**. Fancy name, simple idea: the database itself decides who sees each row. I write the rule once — "you can see this if you own it, or if it's shared with your workspace" — and Postgres enforces it on every query. The browser can talk to the database directly and it's *still* safe, because the database just refuses to hand back rows you're not allowed to see.

So the most dangerous part of any multi-user app is mostly not my code anymore. It's a rule the database won't let me break.

> 🎨 **IMAGE HERE — "the database is the bouncer."**
> A simple diagram: a browser and an edge function both firing queries at a Postgres database. In front of the database sits a gate/shield labeled **"Row-Level Security"** that filters rows before anything comes back — show one private row visibly blocked at the gate.
> **Generation prompt:** *"Flat minimal vector diagram, light/dark friendly. Left: a browser icon and a server/function icon, both sending arrows toward a database on the right. Between them a shield labeled 'Row-Level Security' acting as a gate — green rows pass through, one red 'private' row is stopped. Clean, 2 accent colors, clearly labeled."*

## The pattern that paid off the most

Here's the part I'm actually proud of, because it transfers to any project.

The functions are thin. The real app lives in shared modules — write-once pieces of logic every function reuses. One place that runs a "tool." One place that screens a message for prompt-injection. One place that loads context for the AI. Written once.

And then something great happened. That same tool code is available to the in-app chat, and to an outside AI connecting over MCP, and to plain REST callers, and to webhooks, and to scheduled jobs. All of them run through the same shared code.

So I built the capability once and got five ways to use it, for free. Build five separate services instead and you're maintaining five copies of that logic — and fixing every bug five times.

> 🎨 **IMAGE HERE — "write once, use five ways" (this is the Venn/overlap idea).**
> A hub-and-spoke diagram (or overlapping circles): one center labeled **"Shared logic"** feeding five surfaces that all reuse it — **In-app Chat**, **External AI (MCP)**, **REST API**, **Webhooks**, **Scheduled jobs**. The visual point is the overlap: one shared core, five surfaces on top of it.
> **Generation prompt:** *"Flat minimal vector hub-and-spoke diagram, light/dark friendly. A central node 'Shared logic (write once)' with five arrows out to labeled surfaces: 'In-app Chat', 'External AI / MCP', 'REST API', 'Webhooks', 'Scheduled jobs'. Emphasize that all five reuse the one center. Clean, 2–3 accent colors."*

That's the tell that this whole thing is working, by the way. My `functions/` folder is small, and my shared-logic folder is where all the lines are. When it's backwards — fat functions each reinventing routing and sessions — that's when you know you're fighting the platform instead of using it.

## The sharp edges (because it's not a free lunch)

I'd be lying if I said it was all smooth. Here's the honest cost so you go in with eyes open.

**You're coupled to the platform.** Row-Level Security, the vault, the cron, the deploy API — this doesn't pick up and move to some random server without real rework. That's a real trade. I made it on purpose. You should decide the same way.

**Two runtimes.** The functions run on one system (Deno), the frontend on another (Node). A couple of times I had the same bit of logic written twice, once for each side, and had to keep them in sync. Annoying. Solvable with tests, but real.

**The platform has its own gotchas.** Supabase rewrites HTML pages to plain text on their default URLs — an anti-phishing thing — which cost me an afternoon of "why is my page showing me source code." Migration files need careful numbering or the whole deploy rejects. None of these are dealbreakers. They're the tax you pay for the platform doing so much for you.

**Deploys are split.** The frontend auto-ships when I push to main. The functions don't, by default — they need their own step. I ended up building a little escape hatch inside the app just to redeploy functions when I couldn't push.

### And the open-source asterisk (I went and checked this myself)

One worth being straight about. Supabase is open source, and you can self-host the whole thing — Postgres, auth, storage, and yes, the edge-functions runtime and the secrets vault are all in the open-source stack. So you're not locked in a box. You can leave.

But "open source" and "turnkey" aren't the same word. On their **hosted** platform the managed secrets, the one-command function deploys, the cron plumbing — it all just works. **Self-host** it and you own that operational glue yourself. Doable. It's just *more you*.

So the lock-in I mentioned up top is really a convenience-versus-control trade, not a "you can never leave" trade. That's an important difference. And honestly, if you're leaning on the hosted conveniences as hard as I am, it's worth checking the current self-hosting docs for exactly which of them carry over — that line moves as the product changes.

## So — was it worth it?

Yeah. Not because "Supabase writes your app for you." It doesn't — I wrote a ton of feature logic. It's worth it because the boring, dangerous, undifferentiated 70% became someone else's problem, and I got to spend my time on the 30% that was actually the idea.

If you're staring at your next side project and dreading rebuilding auth and permissions again — this is the pitch. Solve that stuff once. Lean on the database to keep you safe. Keep your functions thin and your shared logic fat. Then go build the thing you actually wanted to build.

That's the person closest to the idea getting to ship the idea, instead of drowning in plumbing. Which is the whole reason I keep chasing this stuff.

You don't need a big plan to try it. Pick one small thing you'd normally need a login and a database for. Build that one on Supabase. See how much of the boring part you don't have to write. Then decide.
