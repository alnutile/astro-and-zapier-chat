---
title: "Build Your Own Ambient Slack Agent"
date: 2026-08-19
excerpt: "A review of building your own ambient Slack agent — your own take on Claude in Slack — hosted on your own system instead of a vendor's. It sits in a room, listens against a per-room prompt, builds up memory you can ask about later, and takes actions. This is the outline."
tags: ["ai", "agents", "slack", "automation"]
draft: true
---

> **OUTLINE / DRAFT — not written yet.** This is the skeleton for the post: the
> arc, the sections, and what each one needs to cover once the demo is built.
> Body copy still to be written (in Alfred's voice). Action examples and FAQ are
> intentionally left open until the build is further along.

> **TLDR (draft):** You can build your own ambient Slack agent — your own version
> of an in-Slack assistant — running on your own system instead of a vendor's. Drop
> it into a room, give that room a prompt, and it listens, remembers, and acts. Here's
> how I built one, deployed it, watched it listen, gave it memory, and had it do real work.

---

## Working notes (delete before publish)

- **Angle:** review + build write-up. Not a hype piece. "Here's what worked for me,
  your path may differ." Follows `alfred-technical-writing-voice`.
- **The framing that matters:** this is deliberately *not* Claude in Slack / Claude Tag.
  Two honest reasons: (1) to see how the thing actually works under the hood by building
  it, and (2) plenty of companies won't (or can't) adopt a specific vendor's in-Slack
  agent — so knowing how to roll your own, provider-agnostic, is worth having.
  → Sponsor/tool rule: frame as "the managed option is great; this is about control and
  understanding," never as knocking anyone's product.
- **Where it lives:** hosted on a system I control — Railway, or a managed-agents
  platform. Decide which the demo actually uses before writing the deploy section.
- **Cover image prompt (notebook sketchnote style) — for later:**
  Handwritten notebook page shot from above on a wooden desk. Hand-lettered title
  "AMBIENT SLACK AGENT" with "AGENT" in blue. Three connected boxes left-to-right joined
  by yellow arrows: a blue box "LISTEN (Slack room + room prompt)" with an ear icon, a
  red box "REMEMBER (context/memory)" with a brain icon, a green box "ACT (do something)"
  with a lightning icon. Yellow callout at the bottom: "Your own in-Slack agent — your host,
  your model." Blue-ballpoint-and-markers sketchnote feel, slight page curl, realistic paper.

---

## 1. The big idea — your own in-Slack agent

- What "ambient" means here: it doesn't wait to be @-mentioned like a command bot. It
  *sits in the room and listens*, then decides on its own when something matters.
- The three-beat loop the whole post hangs on: **listen → remember → act.**
- Why build it yourself instead of using the managed in-Slack option:
  - You get to see how it actually works — the point of the exercise.
  - Some companies won't standardize on one vendor's agent; a build-your-own is
    provider-agnostic (bring your own model, your own host).
  - Control over where the data lives and what the agent is allowed to do.
- Set the honest expectation: this is one way that's working for me, not the one true way.

## 2. What it looks like when it's running (show the payoff first)

- Open with the end state so the reader knows where we're going (payoff-first arc).
- Screens/clips to capture during the demo:
  - The agent quietly in a channel, no @-mention, picking up on a message.
  - Asking it later "what did we decide about X?" and it answering from memory.
  - It taking an action (TBD — see §7).
- Keep this short; it's the trailer, not the tutorial.

## 3. The per-room prompt — one agent, different rooms, different jobs

- Key architectural idea from the vision: **the prompt travels with the room.** The
  same agent behaves differently in #support vs #eng vs #standup because each room
  has its own prompt/persona and its own rules for what's worth reacting to.
- Cover: where that per-room config lives, how the listener looks it up when a message
  arrives, and why this is what makes it feel "ambient" rather than a single global bot.
- Note the design decision: room config as data (a table/record per channel) so adding
  the agent to a new room is configuration, not a redeploy.

## 4. How it works — the moving parts

- The listener path: Slack Events API → your service receives message events for
  channels the app is in.
- Draw the flow (diagram candidate): Slack event → your service → load room prompt →
  LLM decides (ignore / remember / act) → optional write-back to Slack.
- The pieces to name plainly:
  - Slack app + event subscription + the scopes it needs (and why "listening" needs
    the app actually in the channel).
  - The service that holds the logic (this is the part that replaces the vendor).
  - The model call — provider-agnostic; note this is where "bring your own model" lands.
- `> NOTE:` callout candidate: the difference between an @-mention command bot and an
  ambient listener is *which events you subscribe to and how you decide to react* — not
  a different Slack feature.

## 5. Building it

- Walk the real build in "let's break it down" pacing, over actual code (no foo/bar).
- Beats:
  - Register the Slack app, turn on event subscriptions, add it to a room.
  - Stand up the listener endpoint; verify Slack's handshake; confirm events arriving.
  - Route an incoming message through the room's prompt and log the decision.
  - Be honest about the fiddly parts (scopes, event verification, dedupe/retries) — the
    struggle is part of the teaching, not something to hide.

## 6. Deploy it — running on my own system

- Deploy target: Railway or managed-agents platform (lock this to whatever the demo uses).
- What "runs on your own system" buys you vs. the managed in-Slack agent: host, data
  location, provider choice.
- Show it live and listening in the room after deploy — the "it's actually on now" moment.

## 7. Memory and context — ask it about what it heard

- This is the heart of the demo: the agent doesn't just react in the moment, it
  **builds up memory** from what it hears in the room.
- Cover:
  - Where memory is stored (a store the agent writes to as it listens).
  - What it decides to keep vs. ignore (tie back to the room prompt).
  - The payoff: come back later and ask "what did we say about X?" and it answers from
    that accumulated context — not from that single message, but from the room's history.
- Demo script: seed a few messages over time, then question it, show the recall.

## 8. Taking action — having it *do* something

- **OPEN / TBD — figure out the concrete examples as the build gets closer to done.**
- The branch in the loop: once it's listened and remembered, it can also *act* —
  applying the context or doing something in the managed agent / connected system.
- Candidate actions to pick from later (choose 1–2 that demo cleanly):
  - Save/append a structured note or summary somewhere.
  - Create a ticket / to-do / table row from what it heard.
  - Post a reaction or summary back into the channel.
  - Kick off a job in the managed-agent side.
- Keep it grounded: one real action demoed end-to-end beats a list of maybes.

## 9. Trade-offs and what's next

- Honest accounting: what you take on by self-hosting this vs. using the managed option
  (ops, scopes, keeping it cheap, guardrails on what it's allowed to do).
- Provider-agnostic recap: why this matters for teams that won't adopt one vendor.
- What I'd add next / where this goes.

---

## FAQ (draft candidates — finalize against final copy)

- Q: What's an "ambient" Slack agent? → listens in a room vs. waits for an @-mention.
- Q: Why build your own instead of using the managed in-Slack agent? → understanding +
  provider choice + control; not a knock on the managed option.
- Q: Does the agent need to be in the channel to listen? → yes; scopes + events.
- Q: How does it remember things I can ask about later? → the memory store + room prompt.
- Q: Can it use a model other than the vendor's? → yes, that's a main reason to build it.
- (Keep answers plain prose so JSON-LD matches the visible text. Convert to `faq:`
  frontmatter once the post is written.)
