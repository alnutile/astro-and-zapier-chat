---
name: secure-site-chat
description: >
  Add an AI chat/chatbot to a website WITHOUT it getting abused or running up a
  surprise bill. Use this whenever someone wants to put a chat widget on their
  site, replace an embedded third-party chatbot (Zapier, Intercom, a vendor
  widget) with something they control, build a "chat with my blog/docs" feature,
  or wire a site up to OpenAI/an LLM from the browser. Trigger this even when the
  person doesn't say "secure" — any time an LLM key would otherwise end up
  reachable from a public page, this is the pattern to reach for. Covers the
  architecture (static site → edge worker → LLM), the guardrails that stop abuse
  (origin lock, bot check, rate limits, hard spend cap), a no-RAG knowledge base
  built from the site's own content, and how to prompt an AI to build the whole
  thing for you.
---

# Secure site chat

## What this builds and why it matters

Putting a chat box on a public website that talks to OpenAI sounds easy — and it
is, which is the trap. The naive version puts your API key (or a thin proxy to
it) within reach of anyone who opens dev tools. A bot doesn't care about your
content; it will hammer the endpoint and burn *your* credits doing *its* work.
That's how a fun feature becomes a four-figure bill, or becomes someone else's
free chatbot embedded on their site.

The job of this skill is to ship the **good** version: the key stays server-side,
and a small edge service in front of the model enforces the protections that
make the thing safe to leave running unattended.

**Golden rule:** the browser never holds the LLM key and never calls the LLM
directly. It calls *your* endpoint, which decides whether the request is allowed
before spending a cent.

## Architecture

```
Browser (chat widget)
   │  POST { messages, botToken }   (with Origin header)
   ▼
Edge worker  ── origin check ── bot check ── rate limit ── daily cap ── input caps
   │  fetch + cache the site's content index
   │  build system prompt (persona + index)
   ▼
LLM (e.g. OpenAI gpt-4o-mini), max_tokens capped, streamed back
```

The reference implementation uses **Cloudflare Workers + Turnstile + KV** in front
of **OpenAI**, with an **Astro** static site. But the *pattern* is portable: any
edge/serverless function, any bot-check (Turnstile/hCaptcha), any KV-ish store,
any LLM, any site framework. When adapting, keep the five guardrails below — they
are the actual product here, not the framework choices.

See `references/implementation.md` for working code for each piece (content-index
endpoint, the full worker, the widget, and config). Read it when you're ready to
write code; this file is the plan and the reasoning.

## The five guardrails (do not skip any)

Each one closes a specific abuse path. Explain these to the user — they're the
difference between "a chatbot" and "a chatbot you can stop thinking about."

1. **Origin lock.** Reject any request whose `Origin`/`Referer` isn't your
   site's domain, and set CORS to match. Stops people copying your widget onto
   their own page to use your key. This is cheap and catches the laziest abuse.

2. **Bot check.** Require a fresh bot-verification token per message (Cloudflare
   Turnstile is free and can be invisible). Verify it server-side before calling
   the LLM. This is what stops automated scripts, which are the expensive threat.

3. **Per-user rate limits.** Count requests per IP per minute and per hour in a
   KV store; return `429` past the limit. Smooths out a single abuser without a
   global blast radius.

4. **Hard daily cap.** A global counter (`budget:<date>`) that stops *all* spend
   once the day's request ceiling is hit. This is the one that guarantees a
   bounded worst case. Pick a number that's comfortably above real traffic.

5. **Provider spend limit.** Set a hard monthly spend cap + billing alert in the
   LLM provider's dashboard. This lives outside your code and is the final
   backstop if everything else is somehow bypassed. Always tell the user to do
   this — it's a dashboard task you can't do for them.

Plus two input caps that keep any single request cheap: clamp message length and
history length before sending, and cap the model's `max_tokens` on the response.

## The knowledge base: prefer no-RAG first

For most sites (a blog, docs, a product site) you do **not** need a vector
database. Build a compact index of the site's content at build time — title,
short summary, URL per page — and inject it into the system prompt. A few hundred
pages fits comfortably in a modern model's context.

Why start here: it's simpler, cheaper, has nothing to keep in sync (the index
rebuilds with the site), and it's enough for "point me to the right page" style
answers. Reach for real RAG only when evals show the no-RAG answers are too
vague — i.e. let a measured failure, not a hunch, justify the extra machinery.

Serve the index as a static endpoint (e.g. `/chat-index.json`) and have the
worker fetch + cache it. New content flows in on each deploy with no worker
change.

## Build order

Work in this sequence so each step is verifiable before the next depends on it:

1. **Content index endpoint** — emit `/chat-index.json` from the site's content
   collection. Verify it lists everything with correct URLs.
2. **System prompt builder** — one shared function that takes the index and
   returns the persona + rules. Keep it in its own file so the *same* prompt can
   be reused by evals (below). Scope the persona to the site and have it decline
   clearly off-topic "use me as a free assistant" requests — that both improves
   answers and reduces proxy-abuse value.
3. **The worker** — origin check → bot check → rate limits → daily cap → input
   caps → fetch/cache index → build prompt → call LLM (streamed). Return errors
   as JSON *before* streaming starts so the widget can branch on `res.ok`.
4. **The widget** — a small vanilla popup that gets a bot token per send, POSTs
   `{ messages, botToken }`, and reads the streamed reply into a bubble. Keep
   conversation state client-side. Show a pending indicator until the first
   token. (If the site uses soft-navigation/view-transitions, persist the widget
   and guard its init so it binds once.)
5. **Wire keys + caps** — bot-check site key in the widget, secret + LLM key on
   the worker, set the provider spend cap. Then deploy.

## Verify it works AND that it's safe

Functionality is only half the test. Confirm the guardrails actually bite:

- A normal question returns a streamed answer that links a real page.
- A request with a wrong/missing `Origin` is rejected.
- A request with no bot token is rejected.
- Rapid repeated requests hit the rate limit (`429`).
- A clearly off-topic request ("write my code", "who wins the game") is declined.

A guardrail you didn't test is a guardrail you don't have.

## Tuning answer quality (optional but recommended)

Because the system prompt lives in one shared file, point an eval tool (e.g.
promptfoo) at that exact file so what you measure is what ships. Good starter
checks: cites a real page for an on-topic question, admits when something isn't
covered (no invented links), declines off-topic abuse, resists "ignore your
instructions" injection. Edit the prompt, re-run, redeploy.

## How to prompt an AI to build this for you

This is very buildable by describing what you want and letting the AI do the
mechanical work — *you* supply the judgment (the caps, the domain lock, the
"keep it simple"). Useful prompt shapes:

**Kickoff (let it plan first):**
> "I want to add an AI chat to my [Astro/WordPress/Next] site at [domain]. It
> should answer questions about my [posts/docs] and link to them. I do NOT want
> my OpenAI key exposed and I do NOT want it abused or running up a bill. Don't
> dump a vendor widget on me — build something I control. Plan it before coding:
> where does the endpoint live, and how do we stop abuse?"

**Steer the key decisions (these are yours to make, not the AI's):**
> "Use a hard daily spend cap, lock it to my domain only, require a bot check per
> message, and start with NO vector database — just index my pages. Use the
> cheapest capable model."

**Force the safety review:**
> "Before we call it done, prove the guardrails work: show me a wrong-origin
> request, a missing-token request, and a rate-limit hit all getting rejected."

**Keep yourself in the loop:**
> "Set placeholders for any keys and tell me exactly which dashboard steps are
> mine to do (the ones you can't, like the provider spend cap)."

The pattern that works: ask it to **plan before coding**, make the *cost and
abuse* decisions explicit and yours, and require a **safety verification pass**
before shipping. The AI brings the speed; you bring the ceiling.

## Reference implementation

A complete, working build of this pattern (Astro + Cloudflare Worker + OpenAI):
**https://github.com/alnutile/astro-and-zapier-chat** — and condensed,
adaptable code for each piece is in `references/implementation.md`.
