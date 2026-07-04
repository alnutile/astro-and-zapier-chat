# Vibe Coding With Confidence — starter rules

These are the "opinion" files from the post **Vibe Coding With Confidence**. They
encode how I like an AI to build a small, real, secure app — so you get the
consistency Lovable/Replit bake in, but on your own terms.

## What's here

- **`CLAUDE.md`** — the main one. The opinionated rules for building the to-do
  system: stack, security defaults (RLS, env-var discipline, never roll your own
  auth), the data model, the two-phase auth flow, realtime, Railway hosting, and
  the Zapier SDK sync agent.

## How to use it

1. Start a **new repo** for your to-do app.
2. Copy **`CLAUDE.md`** into the root of that repo.
3. Open your AI tool (Claude Code, etc.) in that repo and start with something
   small — *"give me a static hello world"* — then let the AI follow `CLAUDE.md`
   as you grow it step by step.
4. Adjust the defaults (framework, provider, how open sign-up is) to taste — they
   are starting opinions, not laws. The **security** rules are the ones to keep.

The point isn't this exact stack — it's having your defaults written down so the
AI builds the same way every time.
