---
title: "Loop Engineering: How a Dumb Checker and a Local Model Beat the Smart One-Shot"
date: 2026-06-29
excerpt: "One-shot prompting is a coin flip on the hard cases. Loop engineering — let the model propose, let a dumb checker grade it, feed the failure back, repeat — turns a small local model into something that beats the expensive one-shot. Here's the pattern, an opt-out-email example, and how I'd run it on Railway with cron."
image: "/images/loop-engineering/cover.png"
tags: [ai, agents, automation, zapier, no-code]
faq:
  - question: "What is loop engineering?"
    answer: "Loop engineering is wrapping an LLM in a feedback loop instead of trusting one answer. The model proposes a result, a deterministic checker grades it against ground truth, and if it's wrong the specific reason is fed back so the model tries again — over and over until it passes or you hit an iteration cap. The model does the creative part; a dumb, reliable checker guarantees correctness."
  - question: "Why use a local model for a loop instead of a cloud API?"
    answer: "Every loop iteration is another model call. On a paid cloud API an aggressive loop over a lot of inputs can run up a real bill. A local model (like gemma3 on Ollama) makes each iteration cost roughly electricity, so you can afford to loop hard. The loop closes the quality gap with bigger models, and running local closes the cost gap."
  - question: "How do I stop a loop from running up cost or never finishing?"
    answer: "Cap the iterations. Give the loop a hard maximum number of tries per item and stop when it passes the checker or hits the cap. Run the model locally so each try is cheap, and only reach for best-of-K retries when the accuracy gain is worth it."
  - question: "How is this different from just writing a better prompt?"
    answer: "A better prompt still gives you one answer you have to trust. A loop adds a grader and a retry. The win isn't a smarter prompt, it's that something finally tells the model when it's wrong and lets it fix it — which is why a modest local model in a loop can beat a bigger model used once."
---

## TLDR

> **TLDR:** When an AI answer is wrong, our instinct is "write a better prompt" or "get a bigger model." Both are the slow, expensive road. The faster fix is a **loop**: let the model propose, let a *dumb deterministic checker* grade it against ground truth, feed the specific failure back, and let it try again. There's a real research paper where this let *local* models rival GPT-4o on a genuinely hard task. We'll steal the pattern, build it for a boring-but-real job — turning messy opt-out emails into clean structured data — run the model locally so looping is basically free, prove it beats one-shot with promptfoo, wire Gmail in with the Zapier Platform SDK, and put the whole thing on Railway on a cron schedule.

I'm no expert handing down rules here. This is just a pattern that clicked for me, and once it clicks you start seeing places to use it everywhere.

---

## The thing I keep watching people get wrong

You ask the AI to do something. The output is wrong. What do you do next?

Almost everyone reaches for one of two levers: *write a better prompt*, or *get a bigger model*. I do it too. And both of those can help a little. But they're the slow, expensive road, and they miss the actual problem.

Here's the reframe that took me embarrassingly long to internalize:

> **You usually don't need a smarter model. You need a feedback loop.**

The model is a generator. It's good at proposing things. What's missing is the part that *checks* the proposal and says "nope, that's wrong, here's why — try again." Add that, and something almost magical happens: a small, cheap, local model starts producing results that a big expensive model couldn't get in one shot.

That's the whole idea. Let me give it a name so we can talk about it:

> **Loop engineering: let the model propose, let a dumb deterministic checker grade it against ground truth, and feed the failure back in — over and over — until it's right.**

The word *dumb* is doing a lot of work there, and we'll get to why it matters.

![Notebook sketch of the loop: propose, check, feedback, repeat](/images/loop-engineering/the-loop.png)

## Where I got this (the receipts)

I'm not making this up out of vibes. There's a paper from late 2025 called *"Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization"* — the system is nicknamed COMPILOT — and it's basically a clinic in loop engineering.

The job they gave the model is gnarly: optimize the inner loops of a program to make it run faster. (Yes, "loop optimization" — the pun where they're using an *interaction* loop to optimize *code* loops is a happy accident, ignore it.) Here's the part that matters for us:

- The LLM **proposes** a transformation.
- A **compiler** — a real, deterministic, no-nonsense compiler — checks it: is this legal? And if so, *exactly* how much faster did it run, measured on real hardware?
- That feedback gets handed back to the model as memory, and it proposes again.
- Repeat.

Three findings jumped out at me:

1. **The loop crushed the one-shot.** Asking a model to just spit out optimized code "struggles to guarantee correctness." The loop got a 2.66× average speedup on a single run, 3.54× if you ran it five times and kept the best — and it beat the hand-built state-of-the-art optimizer on a lot of cases.
2. **Local models became competitive *inside* the loop.** Open models you can run yourself — llama3.3, qwen2.5-coder, gemma3, qwq — landed right up near GPT-4o and Gemini once they were in the loop. The loop closes the gap between a small local model and a frontier one.
3. **They named the cost risk out loud.** Sometimes the model wouldn't stop, kept iterating, and burned money for no gain. Their words: it shows "the importance of restricting the number of interactions." Cap your loops. Hold that thought.

If you only take one sentence from the paper, take this one:

> **Use the LLM for the creative exploration. Use a dumb deterministic system for correctness.**

Everything below is just that sentence applied to a job you and I actually have.

## Our real job: opt-out emails → clean data

Here's a job everybody with an inbox has. People email you to opt out. "Please remove me." "Unsubscribe." "Stop emailing my whole team." It's buried in signatures, forwarded threads, sometimes sarcasm. It's unstructured misery, and getting it wrong has real compliance stakes.

What I actually want is a clean record for each one:

```json
{
  "is_opt_out": true,
  "contact_email": "...",
  "scope": "person | company | list",
  "reason": "...",
  "requested_action": "unsubscribe | delete | stop_contact",
  "confidence": 0.0
}
```

So the question becomes: **what's our compiler?** In the paper, the compiler was the thing that gave hard, trustworthy "yes/no, and here's the measurement" feedback. For pulling structured data out of an email, our checker is a little stack of *cheap, deterministic rules* — and crucially, **not another LLM**:

1. **Schema validation.** Does it parse as JSON and match the schema? (This is the cheap first filter, just like the paper's quick pre-check before the expensive step.)
2. **Grounding rules.** Does that `contact_email` *actually appear in the email text*? Is `requested_action` one of the allowed values? If `is_opt_out` is true, did it actually find a person to opt out?
3. **Optional cross-check.** Is this person even on a list we manage? (You can answer this against your real data.)

This is why I keep saying the checker should be **dumb**. A dumb checker is one you can trust completely. The moment you grade an LLM's output with another LLM, you're back to trusting a guess. A regex that asks "is this email address literally in the source text?" never hallucinates.

## Step 1 — The no-loop baseline (so we have something to beat)

The version almost everyone ships first is one prompt, ask for JSON, parse it, done. Maybe twenty lines.

```
email text  ──►  [ LLM: "return JSON matching this schema" ]  ──►  parse  ──►  hope
```

Run that on the easy emails and it looks great. Run it on the messy ones and you see how it really fails:

- a `contact_email` that *sounds* right but never appeared in the email,
- the wrong `scope` ("remove my team" tagged as a single person),
- an invalid `requested_action` it just made up,
- and the worst one — **confident and wrong**.

The model isn't dumb here. The problem is that *nothing ever told it it was wrong.*

## Step 2 — Add the loop

Now we wrap it. Same model, same prompt to start — but now there's a grader and a retry.

```
        ┌─────────────────────────────────────────┐
        │                                           │
  email ─►  PROPOSE (LLM)  ─►  CHECK (dumb rules)  ─┤
                                  │                  │
                            pass? │ no  ── feedback ─┘  (try again, capped)
                                  │ yes
                                  ▼
                            clean record
```

The flow, mirroring the paper:

1. **Set the stage.** Tell the model the task and the schema, and — a trick straight from the paper — ask it to *analyze the email first* before writing any JSON. That little "think first" step is built-in chain-of-thought and it helps a lot.
2. **Propose.** The model emits a record.
3. **Check.** Run the dumb rule stack.
4. **Feedback.** If it fails, hand back the *specific* reason — not "try again," but `contact_email "bob@acme.com" does not appear in the source text` or `scope must be one of person|company|list`. Specific feedback is the whole game.
5. **Repeat** until it passes *or* you hit a **max-iterations cap**. (There's your cost guardrail — the exact lesson from the paper.)

Here's the heart of it in pseudo-code, because the idea is simpler than it sounds:

```js
async function extract(email, { maxTries = 4 } = {}) {
  let messages = buildInitialPrompt(email); // task + schema + "analyze first"

  for (let attempt = 1; attempt <= maxTries; attempt++) {
    const proposal = await model.chat(messages);     // PROPOSE
    const result = check(proposal, email);           // CHECK (dumb rules)

    if (result.ok) return result.record;             // done

    messages.push(
      { role: "assistant", content: proposal },
      { role: "user", content: `That was rejected: ${result.reason}. Fix it.` } // FEEDBACK
    );
  }
  throw new Error("hit iteration cap without a valid record");
}
```

That same hard email that the one-shot butchered? It now fixes itself in two or three turns, because each turn it gets told *exactly* what was wrong.

## Step 3 — Why a local model makes the whole thing work

Here's the catch nobody mentions when they show you a slick loop demo: **every iteration is another model call.** A loop that retries four times on a thousand emails is four thousand calls. On a paid cloud API, an aggressive loop is how you get a scary bill — the exact runaway-cost failure mode the paper flagged.

So I run the model **locally**. For this I like `gemma3` (the 27B) on [Ollama](https://ollama.com). And I'm picking gemma3 *on purpose* — it's a modest model, on the smaller end of what the paper tested. That's the point. Watching the loop drag a middling local model up to genuinely useful is the most convincing version of this whole argument.

Local flips the economics completely:

- Each iteration costs roughly electricity, so you can loop hard without flinching.
- "No rush" becomes a feature, not a compromise. Batch the inbox overnight. Loop as much as it takes. Wake up to clean data.

And that's the thesis in one line:

> **Loop engineering's one real weakness is cost. Local models erase exactly that weakness. The loop closes the quality gap; local closes the cost gap. Together you get frontier-ish results at hobby cost.**

## Step 4 — Prove it, don't trust it (promptfoo)

I don't want to *believe* the loop is better. I want to *see* it. So I put both versions head-to-head with [promptfoo](https://promptfoo.dev).

Build a small labeled set — twenty or thirty emails covering the real range: a clear opt-out, an ambiguous one, one that's *not* an opt-out at all (a trap), a thread with multiple requests, one in another language, signature noise, a sarcastic one. Then run two configs — **single-shot vs looped** — on the *same* local model.

The assertions lean on the dumb checks first:

```yaml
tests:
  - vars:
      email: file://emails/remove-my-team.txt
    assert:
      - type: is-json
      - type: is-json
        value: file://schema/optout.schema.json   # deterministic
      - type: javascript
        value: output.contact_email && email.includes(output.contact_email) // grounding rule
      - type: llm-rubric
        value: "scope correctly reflects whether one person or a whole team is opting out"
```

Notice most of the grading is deterministic. The `llm-rubric` only shows up for the genuinely judgment-y bits. Then I read the table promptfoo prints — pass rate, average iterations, latency, and cost per config. The pattern I expect (and that the paper would predict): the loop wins on accuracy for almost no extra real cost, *because it's local*, and it visibly rescues the modest model.

## Step 5 — Plug into Gmail with the Zapier Platform SDK

Now the data has to actually come from somewhere and go somewhere. I'm using the **Zapier Platform SDK** for this — the developer SDK where you build a small integration in JavaScript, not the click-it-together version.

- A **trigger** watches a Gmail label and hands each new email's body to our looped extractor.
- A **create/action** takes the clean record and does something real with it — adds it to a suppression list, updates a CRM, appends a row, labels the thread.

To be clear about why I like Zapier for the *glue*: it's been a great tool for me for years, and the SDK means the Gmail auth, the schemas, the retries are all handled and version-controlled instead of being a brittle one-off script I babysit. That's the "integrations without risk" part — it's real code I own, with `zapier test` and `zapier push` in the loop, but I'm not reinventing OAuth at 11pm.

The expensive *thinking* moved local; Zapier stays as the dependable plumbing between my inbox and my data. That's the right division of labor for me.

## Step 6 — Run it on Railway, as an agent on a schedule

Here's where it stops being a script on my laptop and becomes a little service that just *runs*.

I deploy the loop as a small Node service on [Railway](https://railway.app) — same place this blog lives. And this is where two ideas show up that are worth seeing in the wild:

- **It's an agent.** Not in the buzzword sense. In the real one: it perceives (reads an email), acts (proposes a record), observes feedback (the checker), and adapts (retries). A propose-observe-refine loop *is* the agent. There's no magic beyond the loop you already built.
- **Cron makes "no rush" real.** Railway runs the sweep on a schedule — say every morning at 6 — so the inbox gets processed in a batch while I'm asleep. The "take your time, loop hard, it's cheap" story isn't a vibe anymore; it's a cron expression.

```
Railway cron (06:00 daily)
        │
        ▼
[ agent service ]
   ├─ Zapier SDK: pull new "opt-out" emails from Gmail
   ├─ for each email: run the LOOP (propose → check → feedback → retry, capped)
   └─ Zapier SDK: write clean records to the suppression list
```

"But wait — a *local* model on a *cloud* host?" Fair. The loop is portable; the model endpoint is just a config line. In production you point it at an OpenAI-compatible endpoint — your own Ollama exposed through a tunnel, an Ollama box you run, or a cheap hosted small model. The key is that you already *proved* the job works on a modest model with a capped loop, so whatever you point at, the bill stays small and predictable. The architecture doesn't change; one URL does.

## The bigger pattern (the part to actually remember)

This was never really about emails. It's a recipe you can reuse anywhere:

> **Generator (an LLM, ideally local) + a dumb deterministic verifier + a feedback loop + an iteration cap.**

And here's the bit I like most. This is what finally makes "vibe coding" *not* reckless. You get to let the model explore freely — go wild, propose anything — precisely *because* a hard checker, not your faith in the model, has the final say. Freedom on top, a guardrail underneath.

Once you have this lens, you see it everywhere there's a cheap way to check "is this right?":

- code that has to pass tests,
- SQL that has to actually run,
- data that has to match a schema,
- configs that have to validate.

So here's where I'd leave you. Pick one task where you can *cheaply check correctness*. Write the checker first — the dumb, boring, trustworthy checker. Then let a local model loop against it. That's loop engineering, and it's the most leverage I've found for the least money in a while.

These ideas fade and get renamed every few months, sure. But this one's worth keeping in the toolbox.

## Want to dig in? Start here

- **[COMPILOT — "Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization" (arXiv)](https://arxiv.org/abs/2511.00592)** — the paper this whole post leans on. The local-models-in-a-loop tables are the good part.
- **[promptfoo](https://promptfoo.dev)** — for the side-by-side eval with a cost column.
- **[Ollama](https://ollama.com)** — for running gemma3 (and friends) locally.
- **[Zapier Platform SDK](https://docs.zapier.com/platform/home)** — for building the Gmail integration in code.
- **[Railway](https://railway.app)** — for deploying the agent and running it on cron.
