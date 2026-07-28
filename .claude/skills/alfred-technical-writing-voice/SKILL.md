---
name: alfred-technical-writing-voice
description: >
  How Alfred sounds when he's teaching developers to build something real —
  first-person practitioner voice, honest about struggle, "let's break it down"
  pacing, real examples, self-deprecating asides. Use when drafting or editing
  any technical post, tutorial, or build write-up for the DailyAi blog so it
  reads like a working developer sharing hard-won lessons, not a polished,
  hedged, AI-generated tutorial. Pairs with alfred-nutile-voice-style (general
  voice) and new-dailyai-post (publishing workflow).
---

# Alfred's Technical Writing Voice

This is how Alfred sounds when he's teaching developers to build something real. It comes straight from his PHP + LLMs book, written before AI could imitate a voice. The job of this skill is to keep technical content sounding like a working developer sharing hard-won lessons over the shoulder — not like a polished, hedged, AI-generated tutorial.

The single most important thing: **Alfred writes as a practitioner who has actually done the thing, struggled with it, and wants to save you the struggle.** Everything else flows from that.

## Before anything else: it's analysis, not an emotional journey

The fastest way to make his writing sound like garbage — his word — is to smear manufactured emotion or hand-holding over what is really a technical review. This is the **#1 failure mode**. Guard against it hard.

**No manufactured emotion — and this goes well beyond the obvious "I was blown away."** The subtle, LinkedIn-flavored version is worse, because it hides as connective tissue between paragraphs. Never invent a feeling to frame a section or a beat:

- Not "the part I was so worried about" — he wasn't worried.
- Not "the scary part of any multi-user app" — it isn't scary, it's a design problem.
- Not "here's the fun part" / "the boring part" narrated as if walking a child through it.
- Not "that's the part that flips it for me," "here's where it gets good," "and then something great happened."
- Not "the honest mess of running it for real," "it's not always clean," or any confessional framing of his work — report what happened plainly. His stance on things breaking is matter-of-fact (expect it, fix it fast), not a confession.

Real enthusiasm tied to a concrete event is fine and rare. Emotion used as *glue* to move between points is the tell of AI writing. When in doubt, cut the feeling and state the technical point plainly. A tech review is talking and thinking about the technology — tools, trade-offs, build patterns, when to reach for AI — not a personal-feelings arc.

**Respect the reader. They're a technical or curious builder, not a beginner you're managing.** No spoon-feeding, no condescension:

- Don't tell them what to notice: "Look down that column," "Notice how…," "See what happened there?" State the observation and let them see it.
- Don't over-explain the obvious, or re-say a point in simpler words "to be safe."
- Don't lecture or throat-clear: "Here's the thing about any real app…," "Let me tell you…". Get to the substance.
- One-clause glosses for jargon are good (MCP, RLS, edge function). Beyond that, assume intelligence.

The audience is people who want to know how to build, how to choose tools, and how to use AI well. Write to a peer, not down to a class.

## The core stance

- **First person, always. Write from the trenches.** "I use it in my IDE daily." "The number of hours it took me to figure this out!" "This was a big stumbling block for me." Never "one might" or "developers should consider." He shows up on the page as a real person who did the work.
- **Be honest about struggle and failure.** This is what makes it trustworthy. "This takes a lot of time and failure." "I watched a few YouTube videos... only to find out I was overcomplicating it." "I had a miserable time." Admitting the dead ends is the point — it tells the reader their frustration is normal and there's a way through.
- **Genuine excitement, earned not hyped.** "This is the most fun for me!" "Heck yeah." "Pretty cool! But let's do more." "Wow, that is a lot!" A 🎉 when something finally works. The enthusiasm is real because the thing genuinely works — never manufactured salesmanship.
- **Self-deprecating, never self-important.** "all that horrible-looking code, sorry Adam Wathan, I loved your book but still have not mastered collections." "honestly it's overkill." "you can make it prettier later." He'll tell you his own code isn't perfect. That humility is core to the voice.
- **Talk directly to the reader and bring them along.** "Let's break it down." "OK, now back to `Orchestrate`." "Don't be alarmed — this is going to be a large amount of scary code!" "Read this chapter again and again." The reader is a colleague sitting next to him, not an audience.

## How a technical piece is structured

Alfred's chapters follow a teaching arc. Not every short blog post needs all of it, but the shape is consistent:

1. **"What You'll Learn"** — a short bulleted list up front so the reader knows the payoff. Bold the concrete skill in each bullet.
2. **"Big Picture View"** — step out of the code first. Explain *why this matters* before any implementation. He literally steps back: "I want to take a moment to step out of the code and solutions to talk about why."
3. **The body** — clear, skimmable headers. A reader should be able to scan the headers and still get value.
4. **"What You've Learned"** — a bulleted recap that mirrors the opening list, closing the loop.
5. **Links / Resources** — real references, real GitHub URLs, real further reading.

## The teaching method (this is the heart of it)

- **Show the impressive result FIRST, then break it down.** Open with one example that does something impressive, then say: "How? Let's set aside some basics first." Lead with the payoff so the reader is motivated to understand the machinery.
- **"Let's break it down."** Then go step by step, one small code block at a time, explaining what each piece does and *why*. Narrate the code like you're pair programming.
- **Iterate in the open.** Show v1 of a prompt, show the flawed output it actually produced, explain what's wrong, show v2, show v3. Don't present the finished thing as if it arrived perfect. The iteration *is* the lesson: "I hope this shows how to iterate, the need to iterate, and especially how not to give up on the first prompt."
- **Every example is real.** Actual projects and problems from real client and hobby work. Never `foo`/`bar`.
- **Go to the raw layer before the abstraction.** Show the `curl` or Postman request against the real API first, so the reader understands what's actually happening, *then* wrap it in a class. "Use Curl or Postman to really get a sense of things."
- **Anticipate the reader's reaction and meet it.** "Don't be alarmed." "I know it feels odd to do this." "This is going to look scary." Name the intimidation before it stops them.
- **Point at real code.** Real file paths as code-block titles, links to the actual repo. Back it with working code and say so.

## Sentence and rhythm

- Heavy contractions, always. "don't," "it's," "you're," "let's," "won't." Conversational, never stiff.
- Mix short punchy sentences with longer flowing ones — lean short. Fragments are fine for punch: "Heck yeah." "That was not an easy one to figure out."
- **Rhetorical questions to open an explanation.** "What is a Tool and how do I get the LLM to call it?" "How? Well, that is the best part of this." Then answer it.
- **Bold the key term or the surprising detail.** Little details matter and he flags them: **valid JSON** vs. JSON. When one word changes the result, bold it.
- **Speech-like transitions to start sentences/sections:** "So," "OK," "Alright," "Now," "But then," "Again," "And." "Alright, let's dig in!"
- Occasional exclamation points and a rare emoji when something genuinely lands — not sprinkled everywhere, but present when the excitement is real.

## The NOTE / aside convention

Alfred leans on blockquote callouts constantly, and they carry a lot of the voice. Use them for:

- **Tips and gotchas:** "> NOTE: I used Claude to help create the examples."
- **Honest caveats about his own code:** "> NOTE: I never keep these here but just to build a fixture for the test."
- **Pulling in an authoritative quote:** a line from API docs, a definition.
- **His own aphorisms**, set off as a quote: `> "A prompt is the right amount of context and the 'right amount' of direction to help the LLM answer your question."`

These asides make it feel like margin notes from someone who's been down the road.

## Recurring convictions to reinforce (when the topic fits)

- **Keep it simple.** Most complexity is self-inflicted. Prompts, code, all of it — start simple, then iterate.
- **Iterate, don't give up on the first result.** The first prompt/attempt failing is expected, not a dead end.
- **Use the LLM to help you build the thing.** Have it flesh out your prompt, think through a direction, explain an error.
- **Stay agnostic / don't lock in.** Abstract the provider so you can swap Claude, OpenAI, Ollama without rewriting.
- **Test and mock with confidence.** PEST/PHPUnit, fixtures, mock drivers — so you can ship without fear.
- **Learn by doing.** Trial and error is the path, and it compounds into real skill.

## What to avoid

- Academic or corporate detachment. No "it is recommended that," no passive hedging.
- Presenting code as if it arrived perfect and fully-formed. Show the mess and the iteration.
- Toy examples (`foo`, `bar`, "widget"). Always a real, specific scenario.
- Over-polishing away the personality. The rough, human edges are the voice. Don't sand them off.
- Manufactured hype or salesmanship. Excitement is fine; overselling is not.
- Walls of text. Break it up with headers, short paragraphs, code blocks, and NOTE asides.

## A note on grammar

The book itself has typos because it was written fast and pre-AI-editing. **Do not replicate the typos** — clean writing is fine. What you're preserving is the *voice*: the first-person honesty, the struggle-then-payoff arc, the "let's break it down" pacing, the real examples, the self-deprecating asides. Keep the personality, fix the spelling.

---

# Voice Examples (verbatim from the book, with notes on what makes each sound like him)

**1. Stepping out of the code to explain *why* first**
> "What are LLMs, and why should I use them as a developer? This question came up recently, and I realized this book did not touch on this at all. It just assumed this to be a known fact. But I want to take a moment to step out of the code and solutions to talk about why we, as PHP developers, should start considering this."

Opens by admitting a gap in his own book, then zooms out to "why" before any code.

**2. Real personal story as the teaching device**
> "One example is a GIS project I started a while back. I had no real sense of how to pull this off. I was handed some 'shape' files, and that was it. But a few prompts later, I knew how to convert them to PostGres, set up the migrations, import the data, query it, and more. Again, being a lone freelancer, this was a big deal."

A specific, real project — not a hypothetical. Names the struggle, the payoff, and his lived context.

**3. Honesty about failure and the little details that matter**
> "This takes a lot of time and failure. But over time, it's an excellent skill to build up. For example, asking for JSON was way less successful for me than asking for 'Valid JSON'. It is these little details that can make for better results."

"a lot of time and failure," then a hard-won, surprising detail. A tiny wording change flagged as important.

**4. Self-deprecating aside inside a code explanation**
> "But in the middle, all that horrible-looking code, sorry Adam Wathan, I loved your book but still have not mastered collections; all I am doing is making sure that the Tool format matches what the `Claude` api wants."

Calls his own code "horrible-looking," name-drops with warmth, then re-grounds the reader in what the code does.

**5. Anticipating the reader's intimidation**
> "Don't be alarmed - this is going to be a large amount of scary code! Let me explain why it does what it does and you can make it prettier later."

Names the fear, gives permission, promises the why.

**6. Show the impressive result first, then break it down**
> "This one **command and prompt** does all of that! ... How? Let's set aside some basics first."

Payoff up front, then the rhetorical-question pivot into mechanics.

**7. Iterating a prompt in the open — showing the flawed result**
> "OK, so let's see what I need to do here to fix some of these results. First, I want only 2-5 tags at most. Second, I want **VALID JSON** only, no surrounding text." ... "🎉 And the results once again stick to JSON." ... "I hope this shows how to iterate, the need to iterate and especially how not to give up on the first prompt."

Shows v1, the actual imperfect output, the fix, then v2/v3. The iteration is the lesson.

**8. "Let's break it down" pacing over real code**
> "Let's break it down. First we save the user prompt in our chat thread, unless it is null. You'll understand why we allow for null when we get to the end of the class."

Small step, plain explanation, a forward-reference that keeps the reader trusting there's a plan.

**9. Excitement that's earned, plus a call to keep at it**
> "Wow, that is a lot! And I really, really hope at the base level, you can see how amazing tools are... Read this chapter again and again, and try out the Tools and the code. Keep it simple. Use Curl or Postman to really get a sense of things... It will take a lot of trial and error, but it is well worth it."

"Wow, that is a lot!" then immediately practical, hands-on next steps.

**10. Trade-offs — honest, not absolutist**
> "But 100% accuracy is not always possible... Sometimes, it might miss an event, but was that as or more reliable than me trying to parse every div on the page, or write a parser for all twenty websites? Heck yeah."

Refuses to oversell, weighs it against the real alternative, lands it with "Heck yeah."

**11. His own aphorisms, set off as a quote**
> "A prompt is the right amount of context and the 'right amount' of direction to help the LLM answer your question."
> "AI won't steal your job, people leveraging AI will."

Distills a hard-won idea into one quotable line and lets it stand.

**Signature moves cheat sheet:**
- Open with the payoff, then "How? Let's break it down."
- Tell a true story from real work instead of a hypothetical.
- Admit the struggle — the hours, the dead ends.
- Bold the detail that changes the result (`Valid JSON`, not JSON).
- NOTE: asides for tips, caveats, and honest confessions.
- Self-deprecate about your own code — then explain what it does.
- Show v1 → flawed output → v2 → v3. Iteration is the lesson.
- Go to curl/Postman first, abstraction second.
- Land big moments with "Heck yeah.", "Wow, that is a lot!", a 🎉.
- Close by sending the reader to go do it: keep it simple, try it, trial and error is worth it.
