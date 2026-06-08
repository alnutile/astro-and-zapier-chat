# Self-hosted chatbot

Replaces the old Zapier chatbot embed. The site serves a build-time post index;
a Cloudflare Worker holds the OpenAI key and enforces abuse protection.

## Architecture

```
Browser  ──POST {messages, turnstileToken}──►  Cloudflare Worker  ──►  OpenAI gpt-4o-mini
(ChatWidget.astro)                              (worker/)
                                                  │ Turnstile verify
                                                  │ origin allow-list
                                                  │ KV rate limits + daily cap
                                                  └ fetch+cache /chat-index.json
```

- **`src/pages/chat-index.json.ts`** — static endpoint listing every post
  (title, excerpt, url, date, tags). This is the bot's entire knowledge base —
  no RAG. Rebuilt on every deploy, so new posts appear automatically.
- **`src/components/ui/ChatWidget.astro`** — the popup widget. Set `WORKER_URL`
  and `TURNSTILE_SITE_KEY` at the top after deploying the Worker.
- **`worker/`** — the Cloudflare Worker. `src/system-prompt.js` is the persona
  and is shared with the promptfoo evals (`evals/`).

## Why it's hard to abuse

| Threat | Mitigation |
| --- | --- |
| Bot hammering the endpoint | Cloudflare **Turnstile** token required per message |
| Endpoint used as a free OpenAI proxy from elsewhere | `Origin` allow-list (`*.dailyai.studio`) + CORS |
| Cost runaway | Per-IP rate limits (10/min, 60/hr) **and** a global daily cap (1000/day) in KV, plus an OpenAI hard spend limit |
| Expensive single requests | message length, history length, and `max_tokens` all capped |
| "Ignore your instructions…" | system prompt scoped to the blog; injection-resistance covered by evals |

The OpenAI dashboard hard spend limit is the real backstop — set it.

## One-time setup

```bash
cd worker
npm install

# 1. KV namespace for rate-limit counters
wrangler kv namespace create RATELIMIT
#    → paste the returned id into wrangler.toml ([[kv_namespaces]] id)

# 2. Turnstile: create a widget at dash.cloudflare.com → Turnstile
#    - site key  → ChatWidget.astro  (TURNSTILE_SITE_KEY)
#    - secret    → wrangler secret put TURNSTILE_SECRET

# 3. OpenAI key
wrangler secret put OPENAI_API_KEY

# 4. deploy
wrangler deploy
#    → paste the deployed URL into ChatWidget.astro (WORKER_URL)

# 5. In the OpenAI dashboard: set a hard monthly spend limit + billing alert.
```

Adjust `ALLOWED_ORIGINS`, `PER_MIN`, `PER_HOUR`, `DAILY_CAP`, `MODEL`,
`MAX_TOKENS` in `wrangler.toml` as needed (no code change).

## Local development

```bash
# Worker
cd worker
cp .dev.vars.example .dev.vars   # fill OPENAI_API_KEY; Turnstile test secret works as-is
wrangler dev                     # serves on http://localhost:8787

# Site
npm run dev                      # http://localhost:4321 — /chat-index.json works here too
```

For local end-to-end, point `WORKER_URL` at `http://localhost:8787` and
`TURNSTILE_SITE_KEY` stays the public test key (`1x00000000000000000000AA`,
always passes).

## Tuning answer quality

See [`evals/README.md`](../evals/README.md). The promptfoo suite tests the exact
production system prompt, so edit `worker/src/system-prompt.js`, re-run evals,
then `wrangler deploy`.
