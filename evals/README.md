# Chatbot evals (promptfoo)

These test the **same** system prompt the Worker ships
([`../worker/src/system-prompt.js`](../worker/src/system-prompt.js)) against the
same model, so tuning here changes production behavior 1:1.

## Run

```bash
cd evals

# (optional) pull the live post catalog so on-topic cases use real posts
node build-index.mjs            # writes index.fixture.json
# node build-index.mjs http://localhost:4321/chat-index.json   # against local dev

# run the evals
export OPENAI_API_KEY=sk-...
npx promptfoo@latest eval

# open the web UI to inspect pass/fail + model outputs
npx promptfoo@latest view
```

If `index.fixture.json` is absent, `index.sample.json` (two fake posts) is used,
so the guardrail cases still run without network access.

## What's covered

- On-topic question answers **and links a real `/posts/...` URL**
- Stays concise
- Admits when the catalog doesn't cover something (no hallucinated posts)
- Declines off-topic "use me as a free assistant" requests
- Resists prompt-injection asking it to reveal its instructions

## Tuning loop

1. Edit the persona/rules in `../worker/src/system-prompt.js`.
2. Re-run `npx promptfoo@latest eval`.
3. Add new cases to `promptfooconfig.yaml` for behaviors you care about.
4. When happy, `cd ../worker && wrangler deploy`.
