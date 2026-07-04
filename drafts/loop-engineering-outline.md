# Loop Engineering — working outline

> Status: **working draft / outline** (not for publish yet). Lives in `drafts/` so the
> Astro content collection (`src/content/posts/**`) does not pick it up and it stays out
> of the build + chatbot index. When we're ready to publish, move the finished post into
> `src/content/posts/` via the `new-dailyai-post` skill.

## Decisions locked
- **Zapier path:** Zapier **Platform SDK** (build a small custom integration in JS — the
  developer SDK, not classic Zaps). Frames the "integrations without risk" beat as
  *real code you control*, not just clicking a Zap together.
- **Local model:** **Ollama + gemma3 27B.** A deliberately modest model so the loop's
  "rescue" effect is dramatic — the paper had gemma3-27B at the low end (2.58), which is
  the point: watch the loop drag a middling model up to useful.
- **Eval tool:** promptfoo, single-shot vs looped, same local model, with a cost column.

## Source grounding (the paper)
"Agentic Auto-Scheduling: An Experimental Study of LLM-Guided Loop Optimization"
(COMPILOT, PACT 2025). An LLM proposes compiler loop-nest transformations; the **compiler
is the ground-truth judge** (legal/illegal + *measured* speedup); feedback is appended to
the conversation as working memory; propose → grounded feedback → refine → repeat.

Three findings we lean on:
1. **Loop beats one-shot, and beats the hand-built expert.** 2.66× single-run → 3.54×
   best-of-5; beat the SOTA Pluto optimizer in many cases. Direct one-shot generation
   "struggles to guarantee correctness."
2. **Local/open models become competitive *inside* the loop.** llama3.3-70B 3.08,
   qwen2.5-coder-32B 3.00, qwq-32B 2.94, gemma3-27B 2.58 — near gemini-2.0-flash 3.54 /
   gpt-4o 3.26. The loop closes the small-vs-frontier gap.
3. **Cost risk is real and named.** The model sometimes won't stop → runaway iterations →
   cost with no gain → "importance of restricting the number of interactions." Fix: cap
   iterations + run local.

The transferable principle (callout): **LLM for exploration, deterministic system for
correctness.**

---

## Working title
**"Loop Engineering: How a Dumb Checker and a Local Model Beat the Smart One-Shot"**
Alts: "The Loop Is the Product" · "Stop One-Shotting: Loop Engineering for People Who Hate Cloud Bills"

**Excerpt:** "Single-shot prompting is a coin flip. Loop engineering — let the model
propose, let a dumb deterministic checker grade it, repeat — turns a small local model
into something that beats the expensive one-shot. We'll build one that turns messy opt-out
emails into clean structured data, wire it to Gmail with the Zapier Platform SDK, and
prove it with promptfoo."

**Tags:** `[ai, agents, loop-engineering, local-models, prompt-engineering, zapier, evals, no-code]`

---

## TLDR (top of post)
- One-shot prompting fails silently on the hard cases. The fix isn't a bigger model — it's
  a **loop**: propose → verify against ground truth → feed the failure back → retry.
- There's a real paper (COMPILOT) where this let *local* models rival GPT-4o on a genuinely
  hard task. We steal the pattern.
- We build it for a boring-but-real job: **unstructured opt-out emails → structured
  records**, fetched and acted on via a custom **Zapier Platform SDK** integration + Gmail.
- We run the model **locally** (gemma3 27B on Ollama) so looping is basically free — which
  neutralizes loop engineering's one big downside: cost.
- We prove loop > no-loop with **promptfoo**, side by side, including dollar cost.

---

## Part 1 — The thing junior devs keep getting wrong
*(the "back to basics" hook)*
- The instinct: "output was wrong → write a better prompt / get a bigger model." Both are
  the slow, expensive road.
- The reframe: **you don't need a smarter model, you need a feedback loop.** The model is a
  generator; you're missing the grader.
- One-sentence definition (the heavy-lifting line): *"Let the model propose, let a dumb
  deterministic checker grade it against ground truth, and feed the failure back in — over
  and over — until it's right."*
- Tease the payoff: a *small local model* beating a *big cloud one-shot*, and "vibe coding"
  made safe because the **checker** — not your trust in the model — guarantees correctness.

## Part 2 — Where this comes from (the receipts)
*(short + honest — point at the source material)*
- COMPILOT in plain English: LLM proposes loop transformations; **compiler is the
  ground-truth judge** (legal? how much faster, measured?); feedback goes back; iterate.
- The two numbers: **loop beat one-shot AND the hand-built expert tool**; **local models
  landed next to GPT-4o once inside the loop.**
- The honest caveat: the loop can run away and burn money if uncapped. Foreshadow the fix.
- Pull-quote callout: **LLM for exploration, deterministic system for correctness.**

## Part 3 — Our real job: opt-out emails → structured data
- Why this example: every inbox has "please remove me / unsubscribe / stop emailing my
  team," buried in signatures, threads, sarcasm, forwards. Real compliance stakes.
- Target schema (our "is it correct?" contract):
  ```json
  { "is_opt_out": true, "contact_email": "...", "scope": "person|company|list",
    "reason": "...", "requested_action": "unsubscribe|delete|stop_contact",
    "confidence": 0.0 }
  ```
- **The key design question — what's our "compiler"?** In the paper the compiler gives
  objective truth. For extraction, our ground-truth checker is a stack of *cheap,
  deterministic* rules — not another LLM:
  1. **Schema validation** (parses + matches the Zod/JSON schema) — the cheap pre-filter,
     exactly like COMPILOT's two-stage check.
  2. **Grounding rules** (does `contact_email` actually appear in the source text? is
     `requested_action` a valid enum? if `is_opt_out` is true, is there an identifiable
     contact?).
  3. **Optional cross-check** against the real list/CRM (is this person even on a list we
     manage?).
- Callout: the checker is **dumb and deterministic on purpose** — that's what makes the
  loop trustworthy and avoids "LLM grading LLM" circularity.

## Part 4 — Build it: the no-loop baseline first
- Single-shot: one prompt, ask for JSON, parse, done. ~20 lines.
- Run on the messy cases; show it failing the way it really fails (hallucinated email not in
  the body, wrong scope, invalid enum, confident-but-wrong).
- Point: the model isn't dumb — **nothing ever told it it was wrong.**

## Part 5 — Build it: add the loop
- The loop, mirroring COMPILOT's structure:
  1. **Context init** — brief the model on task + schema, and (paper's trick) make it
     *analyze the email first* before emitting JSON = built-in chain-of-thought.
  2. **Propose** — model emits a structured record.
  3. **Verify** — run the dumb checker stack from Part 3.
  4. **Feedback** — on failure, hand back the *specific* reason ("`contact_email`
     'bob@x.com' not found in source"; "`scope` must be one of …") — rich, specific
     feedback like the paper's five feedback categories, appended as memory.
  5. **Repeat** until valid or **max iterations** (our cost cap — the paper's exact lesson).
- Show the same hard case self-correcting in 2–3 turns.
- Sidebar: stopping criteria & the runaway-cost trap — cap iterations; best-of-K only when
  it earns its keep.

## Part 6 — Why local models make this whole thing work
*(the cost payoff — emotional center)*
- The dirty secret of loops: every iteration is another paid API call. On a cloud frontier
  model, an aggressive loop over a full inbox is a scary bill — the paper's exact failure
  mode.
- **Run it local** — gemma3 27B on Ollama (a modest model, on purpose). Marginal cost per
  iteration ≈ electricity.
- "No rush" reframed as a feature: batch the inbox overnight, loop as hard as you want,
  wake up to clean data.
- Thesis stated plainly: **loop engineering's one real weakness (cost) is exactly what
  local models erase. The loop closes the quality gap; local closes the cost gap. Together:
  frontier-ish results at hobby cost** — and the gemma3 rescue makes this visceral.

## Part 7 — Prove it with promptfoo
- Labeled eval set (~20–30 emails): clear opt-out, ambiguous, *not* an opt-out (trap),
  multiple requests in one thread, foreign language, signature noise, sarcasm.
- Two configs head to head: **single-shot vs looped**, same local model (gemma3 27B).
- Assertions: `is-json` + `json-schema` (deterministic), field-level equality, a custom JS
  assert for the "email appears in source" rule, and an `llm-rubric` only for the
  judgment-y fields.
- The money table: **pass rate, avg iterations, latency, $ cost** per config. Expect the
  loop to win on accuracy at trivial added cost *because it's local* — rescuing the modest
  model the way the paper's loop rescued the small ones.

## Part 8 — Close the loop into the real world with the Zapier Platform SDK
- Build a small **custom Zapier integration** (Platform SDK / `zapier-platform-cli`, JS):
  - **Trigger:** new email in a Gmail label → hands the body to our looped extractor.
  - **Action / create:** takes the clean structured record → suppression list / CRM / sheet
    / labels the thread.
- "Integrations without risk" beat: it's *real code you own and version*, with auth + schema
  handled by the SDK — not a brittle one-off script, not a black-box Zap. Show
  `zapier test` / `zapier push` in the flow.
- Tie-back to the platform's own story: we retired the old Zapier Table sync for cost — so
  this is a *tasteful* Zapier use (the glue), with the expensive thinking moved local.
  Honest and on-brand.

## Part 9 — The bigger pattern (the takeaway)
- It was never about emails. The reusable recipe:
  > **Generator (LLM, ideally local) + dumb deterministic verifier + feedback loop +
  > iteration cap.**
- That's how "vibe coding" stops being a risk: the model explores freely *because* a hard
  checker — not your faith — has the final say.
- Where else it drops in: code that must pass tests, SQL that must run, data that must match
  a schema, configs that must validate. Anywhere you can cheaply check "is this right?", you
  can loop.
- Your move (signature closer): pick one task where you can *cheaply check correctness*,
  write the checker first, then let a local model loop against it.

## Further reading
- COMPILOT paper (arXiv / PACT 2025)
- promptfoo docs · Ollama (gemma3) · Zapier Platform SDK (`zapier-platform-cli`)

---

## For the eventual video (rough shot list)
1. Cold open: paste an ugly real opt-out email → one-shot spits out garbage JSON
   (hallucinated email). "Watch."
2. Whiteboard the loop in 30 seconds (propose → check → feedback → repeat).
3. Terminal: run baseline on 5 hard emails, watch it fail.
4. Flip on the loop, same 5 emails, watch them self-correct live.
5. `npx promptfoo eval` → side-by-side table, finger on the cost column.
6. Zapier integration firing end-to-end: email in → clean row out.
7. Recap card: Generator + dumb checker + loop + cap.

---

## Open questions / TODO before drafting
- [ ] Decide gemma3 27B hardware story (VRAM note for readers who want to follow along).
- [ ] Lock the exact schema + which grounding rules ship in the demo.
- [ ] Build the demo code + capture real promptfoo numbers (so the post quotes real runs).
- [ ] Confirm whether the Zapier integration ships as a runnable repo alongside the post.
- [ ] Image plan (miniature-diorama style, matching recent posts).
