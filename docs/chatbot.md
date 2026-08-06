# Self-hosted chatbot

Replaces the old Zapier chatbot embed. The site serves a build-time post index;
a Cloudflare Worker holds the LLM API key and enforces abuse protection.

The LLM endpoint is OpenAI-compatible and defaults to **OpenRouter**
(`openai/gpt-4o-mini`). It can point at any OpenAI-style `/chat/completions`
endpoint by changing `LLM_BASE_URL` + `MODEL` in `wrangler.toml` — no code change.

## Architecture

```
Browser  ──POST {messages, turnstileToken}──►  Cloudflare Worker  ──►  OpenRouter (openai/gpt-4o-mini)
(ChatWidget.astro)                              (worker/)               (OpenAI-compatible endpoint)
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
| Cost runaway | Per-IP rate limits (10/min, 60/hr) **and** a global daily cap (1000/day) in KV, plus an OpenRouter credit/spend limit |
| Expensive single requests | message length, history length, and `max_tokens` all capped |
| "Ignore your instructions…" | system prompt scoped to the blog; injection-resistance covered by evals |

The OpenRouter credit limit (and per-key spend limit) is the real backstop — set it.

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

# 3. OpenRouter key (https://openrouter.ai/keys)
wrangler secret put OPENROUTER_API_KEY

# 4. deploy
wrangler deploy
#    → paste the deployed URL into ChatWidget.astro (WORKER_URL)

# 5. In the OpenRouter dashboard: set a credit limit (and an optional per-key
#    spend limit) so a runaway can't drain the account.
```

Adjust `ALLOWED_ORIGINS`, `LLM_BASE_URL`, `PER_MIN`, `PER_HOUR`, `DAILY_CAP`,
`MODEL`, `MAX_TOKENS` in `wrangler.toml` as needed (no code change).

## Local development

```bash
# Worker
cd worker
cp .dev.vars.example .dev.vars   # fill OPENROUTER_API_KEY; Turnstile test secret works as-is
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
