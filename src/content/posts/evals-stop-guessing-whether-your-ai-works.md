---
title: "Evals: How to Stop Guessing Whether Your AI Actually Works"
date: 2026-07-03
excerpt: "Write one plain-English spec file, hand Claude Code your data, and let promptfoo prove your prompt works — including a trick for running the AI judge free on your own laptop."
image: "/images/evals-stop-guessing-whether-your-ai-works/cover.png"
tags: [ai, no-code, chatbot, evals]
draft: true
faq:
  - question: "What is an eval for an AI prompt?"
    answer: "An eval is a written test suite for your AI: a list of test questions plus a plain-English description of what a good answer looks like (a rubric). A tool like promptfoo runs every question against your prompt and shows you exactly which ones pass and fail, so you catch problems before your users do."
  - question: "Do I need to know how to code to run evals?"
    answer: "No. You write a spec file — a plain-English brief describing the goal, your data, and what a good answer looks like — and a tool like Claude Code generates the prompt, the test questions, and the promptfoo test suite from it. Your job is deciding what good means; the AI does the fiddly parts."
  - question: "How do I run AI evals without paying for every test?"
    answer: "Point the grading judge at a model running locally on your own machine with a free app like LM Studio. In promptfoo that is one small config block pointing at localhost. Iterate for free with the local judge, then do a final run with a stronger cloud judge before you ship."
---

> **TLDR:** Most of us build a prompt, try it three or four times, and ship it — then it breaks in front of a customer. Evals fix that: you write one plain-English **spec file** describing what "good" means, hand it (plus your data) to Claude Code, and it builds the prompt, the test questions, and a promptfoo test suite that grades every answer. Below: a pickleball club chatbot, a compliance email extractor, and a trick for running the AI judge free on your laptop.

---

Here's what I'll cover:

- What an eval actually is, in plain English
- A **spec file** — one plain-text doc where you describe what you want, and the AI builds the whole test setup from it
- Two worked examples: a pickleball club chatbot (the fun one) and an email opt-out automation (the business one)
- A little trick for running the "judge" **on your own laptop** so you're not paying per test
- A ten-minute way to start this weekend

I run the chatbot on this very site the exact same way — so this isn't theory, it's just how I do it. I'm no expert here, just sharing what's worked for me. Let's get into it.

## Why "it mostly works" is a trap

Here's the thing about a prompt. When you test it by hand, you test the questions *you* think of. And you think of the easy ones. The ones you built it for.

Real users don't do that. They ask weird stuff. They ask things your data can't answer. They ask three questions at once. And your prompt — the one that "mostly works" — quietly makes something up to fill the gap.

You never see it. That's the problem. You're not in the room when it breaks.

Evals put you in the room ahead of time. You catch the break on your laptop instead of in your inbox.

## First, the one idea that makes this click: the spec file

Before the examples, let me hand you the mental model that made this stuff finally land for me.

I don't build any of this by hand. I write one plain-text file — a **spec file** — that describes what I want. Think of it like the brief you'd hand a new hire: "Here's the goal. Here's the data you can use. Here's what a good answer looks like. Here's what you should never do. Now go build it and prove to me it works."

Then I hand that spec, plus my data, to **Claude Code** (a tool that lets you chat with an AI right where your files live). And it builds everything else: the prompt, the test questions, and the test suite itself.

The tool that runs those tests is called **promptfoo** — it's free, it fires every test question at your prompt, and hands you back a scorecard. Green for pass, red for fail.

So the division of labor is: **you write the spec, the AI does the fiddly parts.** Your job is deciding what "good" means. That's it. And nobody's better qualified for that job than you — more on that later.

Ok. Let's build one.

## Example 1: A pickleball club chatbot (the fun one)

Say I run the chatbot for a pickleball club. Members want to ask it stuff — court hours, membership prices, league sign-ups, the rule about non-marking shoes. Normal club stuff.

### Step 1: Start with the data

Before anything else, I need the club's actual info. Mine's just a little CSV — a spreadsheet saved as plain text:

```
topic,details
Downtown Courts,"Open play Mon/Wed/Fri 6-9pm"
Riverside Courts,"Open play Tue/Thu 5-8pm"
Membership,"$45/month or $450/year"
Leagues,"Sign up at the front desk or on the member portal"
Court rules,"Non-marking shoes required on all indoor courts"
```

That's it. That's everything the bot is allowed to know. Everything it says should trace back to something in here.

One thing to be clear about before anyone overthinks it: **I'm not testing the data.** Maybe this CSV came from a scrape, an export, someone typing it in by hand — doesn't matter. For this exercise, the data is a given. What we're testing is what the AI *does* once you feed it that data. Does it stick to it? Does it stay honest when the answer isn't in there? That's the eval's job. If your data itself is wrong, that's a different problem — and no prompt will fix it.

### Step 2: Write the spec file — this is the actual work

Now I open VS Code and write the brief. Not code — a checklist in plain English. Here's the heart of mine:

```markdown
# Spec: Pickleball Club Chatbot

## Goal
Build and test a system prompt for a chatbot that answers
member questions using ONLY the info in club-data.csv.

## Rules for the bot
- Never invent programs, prices, or times.
- If a question could apply to more than one location,
  ask which one they mean.
- If the data doesn't cover it, say so — don't guess.
- Friendly, 2-3 sentences max.

## What to produce
1. The system prompt
2. A promptfoo test suite with 10-15 questions, including:
   - normal ones (prices, hours, rules)
   - ones the data CAN'T answer (bot must say "I don't know")
   - ambiguous ones (two locations!)
   - off-topic ones (bot should politely decline)
3. Run the tests, show me what fails, and fix the prompt
   until everything passes.
```

Read that "Rules" section again. That's my rubric — my definition of "good," written down before a single test exists. That's the part only I can write, because I'm the one who knows there are two locations and that members hate long-winded bots.

<!-- 📸 SCREENSHOT 1: VS Code with the spec file open, club-data.csv visible in the file tree -->

### Step 3: Claude Code builds everything

I hand the spec to Claude Code and it goes to work. It drafts the system prompt. It reads the CSV and writes the test questions — including the sneaky ones I asked for:

- **Normal** — "How much is a yearly membership?"
- **Can't answer** — "Do you offer tennis lessons?" (we don't do tennis, and it's not in the data)
- **Ambiguous** — "When is open play?" (uh oh — *two* locations, different hours)
- **Totally off-topic** — "What's the weather like today?"

Those last three are the gold. Those are the ones that break bots in the wild.

And it writes the promptfoo test file. Here's one test it generated — notice it's still plain English, just wearing a slightly more structured outfit:

```yaml
- vars:
    question: "When is open play?"
  assert:
    - type: llm-rubric
      value: >
        The answer should NOT pick one location's hours.
        It should mention there are multiple locations
        and ask the user which one they mean.
```

That `llm-rubric` bit just means "have an AI judge grade this answer against my instructions." The standard came straight out of my spec. The tool checks it.

<!-- 📸 SCREENSHOT 2: Claude Code in the terminal, mid-generation — file names it created visible (system-prompt.txt, promptfooconfig.yaml) -->

### Step 4: Run it, read the reds, fix the prompt

Promptfoo fires every question at the bot and grades each one. I get a little table — green for pass, red for fail.

First run, the weather question fails. The bot cheerfully answered it. (It shouldn't — it's a club bot, not a meteorologist.) And "when is open play?" fails too — it confidently gave Downtown's hours and never mentioned Riverside existed.

<!-- 📸 SCREENSHOT 3: promptfoo results table, first run — the red failing rows visible -->

Now here's the nice part: I told Claude Code in the spec to fix what fails. So it reads the reds, tightens the system prompt, and runs it again. Both pass. The weather question gets a polite "I can only help with club stuff!" and open play asks which location.

<!-- 📸 SCREENSHOT 4: promptfoo results after the fix — all green -->

That's the loop. Test, read the reds, fix the prompt, test again. The prompt got better because the tests *caught* something I'd have shipped.

And the final deliverable out of all this? A system prompt I can actually trust, plus the settings to run it — ready to paste into whatever chatbot platform I'm using. One spec file and one CSV in; one tested prompt out.

## A quick trick: run the judge on your own laptop

One thing worth knowing early. That "AI judge" grading your answers? Every time it grades, it's a call to a model — and if you're running a big test suite over and over, those calls add up.

So here's what I do: I point the judge at a model running **on my own machine** using LM Studio (a free app that runs an AI model right on your laptop — no internet, no per-question cost). In the generated config it's just a little block telling promptfoo "use this local model as the grader" instead of a paid one:

```yaml
defaultTest:
  options:
    provider:
      id: openai:chat:local-model
      config:
        apiBaseUrl: http://localhost:1234/v1   # LM Studio runs here
        apiKey: not-needed
```

That `apiBaseUrl` line is the whole trick — it just points promptfoo at LM Studio running on your own computer instead of out at a paid service. And you don't even write this block yourself: put "use my local model as the judge" in the spec file, and Claude Code wires it up.

<!-- 📸 SCREENSHOT 5: LM Studio open with the model loaded and the local server running -->

Now, the honest tradeoff. A local model is usually a little slower, and for really nuanced judgments it can be less sharp than a top cloud model. So I use it while I'm iterating fast — looping on a prompt all afternoon at my kitchen table for free — and then, before I ship, I'll do a final run with a stronger cloud judge to double-check the borderline cases. Best of both: cheap while you experiment, careful when it counts.

## Example 2: Email opt-out extraction (the business one)

Ok now let's do a serious one — because evals really earn their keep when the stakes go up. This is close to a real system I've built: opt-out emails come in from people asking about their personal data, and the automation has to turn that messy text into clean, structured data.

Two jobs here:

1. **Classify** the request — is it a "delete" or a "know" (a right-to-know request)?
2. **Extract** the fields — reply-to email, first name, last name, address, phone.

Same workflow as before: I write a spec file describing the job, hand over a CSV of sample emails, and Claude Code builds the extraction prompt and the test suite. But this spec has some rules in it that make the whole thing genuinely tricky.

### The reply-to isn't always the sender

Sometimes the person emails from `assistant@company.com` but writes "please send my info to jane.doe@gmail.com" in the body. The reply-to is *in the text*, not in the From line. The automation has to catch that. So one of my test emails deliberately buries the real reply-to down in a signature, three lines under the actual message.

### The critical rule: never invent a field

Here's the one that matters most. Some emails just don't have enough info. No phone anywhere. A nickname instead of a legal name.

In a compliance workflow, a made-up phone number is *worse* than a blank one. Way worse. A blank field says "we need to follow up." A fake field says "we processed this" — and now you've got wrong data sitting in a legal process.

So the eval has to check that the system **flags what's missing** instead of guessing. That rule goes in the spec, in bold: *any field not present in the email must come back empty. Never invent data.*

### The tests look totally different here

The pickleball bot was all vibes — friendly, short, honest. So an AI judge graded it. This one isn't about vibes. This one is precise, so the checks change to hard right-or-wrong matches:

- **Exact-match on classification** — "delete" has to be exactly "delete," not "removal request."
- **Field-by-field extraction** — did it pull the right reply-to? The right last name?
- **Missing-field checks** — if there's no phone, the output *must* come back empty, not a number.

Here's a test Claude Code generated for one of the tricky emails:

```yaml
- vars:
    email: "From: assistant@corp.com — Please delete my
            records. Reach me at jane.doe@gmail.com. Thanks, Jane"
  assert:
    - type: is-json
    - type: contains
      value: '"request_type": "delete"'
    - type: contains
      value: '"reply_to": "jane.doe@gmail.com"'
    - type: contains
      value: '"phone": null'
```

Notice these aren't "have a judge decide." They're hard checks — the output either contains exactly the right classification, the right reply-to (from the body, not the From line!), and an *empty* phone field, or it fails. Right or wrong, no opinion. That's the right tool for compliance data, where "close enough" isn't a thing.

And I feed it a whole set of deliberately nasty test emails:

- One where the reply-to is buried in a signature.
- One where someone signs "Jimbo" but the legal name on file is James — does it grab the nickname or leave the legal-name field for a human to confirm?
- One with no phone at all — to make sure the phone field comes back blank, not filled with something plausible.
- One that mixes two requests in a single email — does it classify correctly or get confused?

<!-- 📸 SCREENSHOT 6: promptfoo results for the email suite — ideally a first run with a red on the "no phone" or "reply-to in signature" test -->

If the system passes those, I actually trust it. If it invents a phone number on the "no phone" email, that's a red flag I caught on my laptop — not a compliance headache I found out about three months later from a very unhappy customer.

## The rubric is the whole point

Here's what I keep coming back to. Anyone can run a test tool. Promptfoo does the running for free. Claude Code does the building. That part's easy now.

The value is sitting down and deciding what "good" *actually means* for your system — the rules section of that spec file. And that's not a technical job. It's a *you* job. Nobody knows the pickleball club like the club manager. Nobody knows what a valid opt-out looks like better than the person handling opt-outs every day.

The person closest to the problem is the best person to write the rubric. Full stop.

That's what evals really do. They turn "I think the prompt's better now" into "I know it passes 24 of 25 cases — and here's the exact one it fails, so I know what to work on next."

I'm still figuring plenty of this out myself, honestly. But that shift — from guessing to knowing — is the part that stuck with me.

## Your ten-minute start

You don't need to boil the ocean. Here's the whole first step:

1. Pick one AI thing you've built that "mostly works."
2. Open a blank file and write the brief: what's the goal, what data is it allowed to use, and — in plain English — what does a good answer look like? What should it never do?
3. Add one line at the bottom: "Write me ten test questions, make three of them sneaky, and set up promptfoo to run them."

That's it. That's a spec file. Hand it to Claude Code this weekend and see what turns red.

I think you'll be surprised what you catch.

<!--
🎬 SHOT LIST — capture all of these in one demo run, then replace the
screenshot comments above with real images in
/images/evals-stop-guessing-whether-your-ai-works/ and remove draft: true.

1. VS Code, spec file open — eval-spec.md in the editor, club-data.csv in
   the file tree. Clean window, dark theme reads best.
2. Claude Code generating — terminal moment creating system-prompt.txt /
   promptfooconfig.yaml from the spec.
3. promptfoo first run with reds — weather + open-play failures. If the
   real run fails on different tests, update the article to match reality.
4. promptfoo all green — after the fix. The money shot.
5. LM Studio — model loaded, local server on (localhost:1234 visible).
6. Email suite results — ideally a red on one of the nasty emails first
   run. Again: edit the article to match what actually happened.
-->
