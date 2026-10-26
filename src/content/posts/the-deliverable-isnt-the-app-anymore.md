---
title: "The Deliverable Isn't the App Anymore"
date: 2026-10-25
excerpt: "The app is only one piece of what a client needs now. The rest is the package around it: the repo as context hub, a shared room with an agent in it, evals from the start, CI/CD measured against the DORA metrics, and feature flags - and why a solo builder can offer the whole thing."
image: "/images/the-deliverable-isnt-the-app-anymore/cover.svg"
tags: [ai, agents, automation, evals, cicd, dora, feature-flags]
faq:
  - question: "Isn't this just handing the client a chatbot?"
    answer: "No. A chatbot bolted onto an app answers from whatever you fed it, and it drifts out of date as the app changes. This is the AI connected to the repo that is the system: the code, the Terraform, the specs and design guide, and the tests, plus a scoped, read-only way to query real data, all inside the room where the work already happens. The grounding is the difference."
  - question: "Why do evals need to be there from the start, instead of added later?"
    answer: "Because without them you have no baseline. These systems are non-deterministic, and models, prompts and context all change over time, so a month from now you will have no way to tell whether an answer got better or worse except by feel. Evals written at the start give you something to run every change against. They also capture client corrections as permanent cases, so a fix stays fixed."
  - question: "What is the prompt drafting area, in practice?"
    answer: "A shared place - the client room, plus prompt drafts kept in the repo in plain language - where you and the client work on what the AI is told: how it should answer, what it should check, what it should never do, and when it should hand off to a human. Drafts are tested against the eval set before they become the live prompt, and the live prompt is kept somewhere you can edit without a deploy."
  - question: "What are the DORA metrics, and why are they in a piece about working solo?"
    answer: "They are the four measures from dora.dev research on software delivery: deployment frequency, lead time for changes, change failure rate, and time to restore service. They are in here because they are mostly about pipeline and habits, not team size. A solo builder with GitHub Actions, small changes, and automated deploys and rollbacks can sit at the elite end of all four."
  - question: "So can a bug still get to production?"
    answer: "Yes, and any setup that promises otherwise is not being straight with you. Testing, evals, and small changes make it less likely and less serious. What the pipeline really buys you is recovery: health checks surface it quickly, the previous release is still available to switch back to, and a fix can go through the same automated path in minutes. Time to restore is a design choice, not luck."
  - question: "What are feature flags doing in this package?"
    answer: "They separate deploying from releasing. New code goes to production with the flag off, so nobody is affected. Then it is switched on for the builder and the client team first, so it can be tested manually and automatically in the real system, then for a small segment of users, and only then for everyone. If something is wrong, turning the flag off restores the old behavior in seconds, without a redeploy. Most frameworks have a flag library - Laravel has Pennant, Rails has Flipper - so it does not need a separate platform to start."
  - question: "What goes in the specs folder, and what goes in the design folder?"
    answer: "The specs folder holds the decisions, in plain language: the business rules, why a provider or an approach was chosen, what should happen when rules conflict. The design folder holds the design guide: colors, type, spacing, components and how they are used, and example screens. Both live in the repo, versioned, so the humans and the AI are working from the same source."
  - question: "Can the client break production with this?"
    answer: "Not if the gate is built right. Clients explore and propose. Changes land only as pull requests, through tests and evals, with a human review, and they deploy through the same pipeline as everything else. And if a change does cause a problem, the previous release is there to switch back to."
  - question: "What data can the AI actually see?"
    answer: "Only what you scope it to. Read-only data access through MCP, least-privilege, and never secrets or Terraform state. Deciding those boundaries is a core part of the builder's job in this model."
  - question: "I'm a solo developer. Can I really offer all of this?"
    answer: "I think so, and that is kind of the point of the piece. The code is the cheap part now. With solid starter patterns for auth, infrastructure, GitHub Actions, and hosting, one builder can deliver the app plus the environment around it. What you are selling is the patterns, the guardrails, and the stewardship, not a headcount."
  - question: "What replaces project fees in this model?"
    answer: "For most clients, a retainer: ongoing responsibility for the pipeline, the evals, the specs, and being in the room, instead of a one-off build and a handoff. It is the relationship a lot of clients were already asking for, just named and structured."
---

## TLDR

> **TLDR:** Coding is cheap now. What a client actually needs - and what you can actually sell - is the app plus the operating environment around it: a shared room where they can talk to you and to the system, a repo that holds the code, the infrastructure, the decisions and the design guide, a safe way to query their own data, evals that are there from the start, a CI/CD pipeline you can measure against the DORA metrics, and feature flags so that deploying is not the same as releasing. You do not need to be a big agency to offer that. If you can build the app, you can build this package around it. Your job shifts from being the developer they send feature requests to, to being the architect of the patterns that let them explore and steer without breaking it.

---

## The old handoff

For 25 years, the handoff looked pretty much the same.

I would build the thing. I would deploy the thing. I would write some documentation, or mean to write some documentation. Then I would hand over a URL and maybe a PDF, and the phone calls would start.

"How does the discount actually get calculated?"
"Can we see everyone who signed up but never finished?"
"Wait, why does it do that when...?"

Every one of those questions routed back through me. Not because the client could not think for themselves. Because the system was a black box to them. The answers lived in code they could not read, in infrastructure they could not see, and in decisions that were in my head, or in an email thread from three months ago.

And the documentation started going out of date the day I wrote it. The first change after handoff made part of it wrong, and nobody, including me, knew which part.

That model made sense when code was expensive. My value was that I could produce the code. A feature request would come in, and a feature would go out, and the time in between was mostly me typing.

Code is not expensive anymore. So if the code is not the scarce part, why are we still delivering like it is?

## What I deliver now instead

Now the deliverable is a package, and the app is just one piece of it. Let me walk through the pieces, because each one looks small on its own and they only really make sense together.

**1. The app, in a repo that holds everything**

Not just the application code. The Terraform too, and the CI/CD, and a few folders I will come back to in a moment that matter more than they sound: a specs folder where the decisions live, and a design folder where the design guide lives.

One repo that describes the whole system. What it does, what it runs on, how it gets deployed, why it was built the way it was built, and what it is supposed to look like. If it is not in the repo, it did not happen. This is the context hub for this application.

**2. A shared room**

A Slack channel - it does not have to be Slack, any chat your client already lives in works - where the client, their team, and I are all in the same conversation. No ticket portal nobody checks. No separate email thread per person, where half the context is always in the thread you were not on.

This is where the work happens now. Questions, ideas, a "hey, I noticed this" on a Tuesday. All of it in one place, with the context building up as you go.

**3. The AI, tagged into that room, connected to the repo**

This is the piece that has been building across the last few posts, the ambient Slack agent and giving AI its own desk and computer. Claude is in that shared room, and it is connected to the GitHub repo holding the code and the Terraform and those folders I mentioned.

So it does not guess how the system works. It reads how the system works.

And each application basically gets a full agent with a desktop of its own, in the sense I talked about in the agents posts. A Linux machine, with Chrome, a shell, and files it can work with. So when a question in the room turns into real work - go look at this data, go run this process, go check what the system actually did - the agent is not limited to answering from the repo. It has a place to do the work, in the same way a person on the team would sit down at their computer and do it. The room is where you talk to it. The desktop is where it works.

The client can ask, in plain language:

> "How do we handle it when a payment fails?"
> "Walk me through what happens when someone signs up."
> "What would break if we changed this field?"

And the answer comes from the source itself. Not from a wiki I wrote six months ago. Not from my memory on a Tuesday afternoon.

**4. A safe way to query their own data**

Through MCP - the standard way you plug an AI into other tools and data sources - the client can connect to their own data, read-only and scoped to what they are allowed to see, and ask questions of it in that same room.

That used to be a feature request, and then a report build, and then a ticket, and then a wait. Now a lot of it is just a question. That is a bigger change than it sounds, especially for a small client who was never going to get a data team.

**5. The guardrails**

Evals, testing, CI/CD, and the security boundaries. Technically, what this is about is what runs, automatically, every time something changes or is proposed: the application tests, the eval cases for the AI parts, the checks in the pipeline before a deploy is allowed to happen, and the limits on what the AI and the data connections can reach - read-only here, nothing there, no secrets anywhere near it. It matters more in this setup than in a normal handoff because of the shape of the work itself. The client is going to be asking the system questions and proposing changes through it on a regular basis, not just at release time, so the checking cannot be a manual step that depends on me remembering to do it. It has to be in the pipeline, running the same way every time, whether I am at my desk or not. I will go through the pieces of it in the sections below.

## The repo is more than code: specs and design

I want to pull on those two folders for a minute, because they are easy to skip, and skipping them is how this whole thing quietly falls apart.

**A specs folder, for decisions.**

Every system has decisions baked into it that are not visible in the code. Why does the refund work this way and not that way. Why did we choose this provider. What is the business rule when these two things conflict. In the old model, those decisions lived in meeting notes, in email, and mostly in my head, and they left when I left.

Now they go in a `specs/` folder in the repo, in plain language, versioned with everything else. When a decision changes, the spec changes, in a pull request, where you can see what the old thinking was and what replaced it.

This matters for the AI too, not just for the humans. When the client asks "why does it work this way," the code can only tell them *how* it works. The spec is where the *why* is. Without it, the AI in the room can describe the machinery and still miss the point of the machinery, which is the part the client actually cares about.

**A design folder, for the design guide.**

Same idea, on the visual side. Colors, type, spacing, the components we use and how we use them, example screens. That goes in a `design/` folder in the repo, as a guide the AI can read, instead of living in a Figma file only one person can open, or worse, in nothing at all.

So when a new feature gets built, by me or with the AI helping, it does not come back looking like it belongs to a different product. It follows the guide, because the guide is right there in the same place as everything else. And when the client asks why something looks the way it does, or wants to change a pattern everywhere at once, there is one place to change it.

Neither folder is a big lift. A spec can start as a few paragraphs in plain English. A design guide can start as a page. What matters is that they exist, in the repo, from early on, instead of being reconstructed later from memory. Because reconstructed from memory is exactly the old model again.

## Documentation that does not go out of date

Traditional documentation is a copy of the truth. Copies drift. The code changes, the copy does not, and pretty soon the copy is out of date and still being quoted back to you as if it were current, which is worse than no documentation at all.

When the AI answers from the repo - the actual code, the actual Terraform, the actual specs, the actual tests - there is no copy. The answer is put together from the source, at the moment you ask.

Change the code, or change a spec, and the next answer reflects the change. There is nothing separate to remember to update. And the notes that do need writing, the why behind a decision, the constraints, what good looks like, those now live with the code, versioned with the code, instead of on a wiki page nobody has opened since 2023.

## Evals, from the start

This is the section I most want to get right, because I think evals are usually talked about as something you add later, once the system is built, if you have time. In this package they are there from the start, and there is a reason for that.

These systems are non-deterministic. I wrote a whole piece on this in the agents post: run an agent twenty times and it might not go the same way every time. Ask an AI the same question about a system next month, after the model has changed, or the prompt has changed, or the context has grown, and you may get a different answer. So how do you trust it?

You use evaluations. And you cannot bolt that on at the end, because by then you have no baseline. You have a feeling that it works, and a feeling is what you had on day one too.

So from the start, before the client is relying on any of this, we write down what has to stay true. Not in abstract terms. In their terms. The real questions they ask. The real searches they expect to work. The cases where the wrong answer would actually hurt.

> "A new signup with a duplicate email should never create two accounts."
> "Asking how refunds work should always mention the 14 day window."
> "This search, with this spelling, should find this customer."

That set is small at first. Five cases is fine. But it exists, and it runs, and it gives you a read on two things at once: whether the system is still doing what it is supposed to do, and what that is costing, so you can find the cheapest model and setup that still passes.

Then comes the part that makes it more than a test suite. It becomes a feedback cycle.

It goes like this. The client asks something in the room. The answer comes back, and it is close, but not quite how they actually do it. Maybe it missed a step in their process, maybe it described the rule the way the code does it and not the way the business thinks about it. In the old model, that correction evaporated. Someone would say "oh, actually..." in a call, and the system would go on being wrong in the same quiet way.

Here, the correction does two jobs. It updates the context - a spec gets clarified, a note gets added - and it becomes a new eval case. That exact question, with that exact expectation, now runs every time something changes. The system does not just get fixed once. It stays fixed, and you can prove it stays fixed, because the case is sitting in CI watching for it.

And that cycle is also where the prompts get written, which is the other half of this.

There is a drafting area for prompts: the shared room, plus a place in the repo where prompt drafts live, in plain language, where the client and I can work on them together. This matters more than most builders expect. The prompt is not a technical artifact. It is where the client's real knowledge goes - how they talk to their customers, what the AI should always check, what it should never offer, when it should stop and hand the question to a human. The client is the expert on most of that, not me. If the prompt lives buried in code that only I can touch, that expertise never really gets in.

So we draft in the open. We try a version against the eval set. We look at where it did well and where it missed, and we adjust the wording, and we run it again. The iteration is visible to the client, and it is in their language, so they can steer it the way they would steer a new employee's handbook, because that is closer to what it is.

> NOTE: I do not like putting the live prompt in code, because I want to be able to update a prompt without a deploy. Keep the prompt somewhere you can edit it. The drafting area is where new versions are worked on and tested. A draft only becomes the live prompt once it passes the evals.

Do you see the loop now? Real use creates corrections. Corrections become evals and better drafts. Better drafts pass the gate and go live. And the next round of real use starts from a better place than the last one. That is how a system like this gets better over time instead of slowly drifting, which is what happened to every hand-off-and-walk-away system I ever built.

## CI/CD, and what DORA taught us about doing this well

If evals are the gate for the AI parts, CI/CD is the gate for everything, and it belongs in the deliverable, not behind the scenes where the client never sees it.

I have been writing about building your own stack, and this is where that work pays off for a client. The pipeline I use is GitHub Actions, and for a typical system it looks like this:

```
pull request
    |
    v
tests run (against a real Postgres and Redis, not mocks of them)
    |
    v
formatting / lint checks
    |
    v
evals run, for the AI parts of the system
    |
    v
the production Docker image is built - the exact image that will ship
    |
    v
push to main, and only if all of the above passed
    |
    v
deploy: migrations, health checks, switch traffic to the new release
    |
    v
the previous release stays right there, ready to switch back to
```

A few things in there are doing more work than they look like. GitHub connects to the cloud account using OIDC, so there is no long-lived access key sitting in a settings page waiting to leak. The image that gets deployed is the image that got tested, not a rebuild that is probably the same. Migrations run as part of the release, and health checks decide whether the new release actually gets traffic.

Now, why do I care about the shape of this pipeline, beyond "it is tidy"? Because there is research on what separates teams that ship software well from teams that struggle with it, and it is not opinion. It is DORA - dora.dev - the group that has been measuring this for years, and that work became the book *Accelerate*. Elite teams, as they call them, are not the ones with the most process. They are the ones that do well on four measures:

- **Deployment frequency.** How often you put code into production. Elite teams deploy on demand, many times a day if they want to. Struggling teams deploy monthly and hold their breath when they do.
- **Lead time for changes.** How long it takes for a commit to get to production. Elite is under a day, and it used to be measured in hours. Struggling is weeks of a change waiting in queues and approvals that are not actually checking anything.
- **Change failure rate.** What share of your deployments cause a problem in production that needs a fix or a rollback. Lower is better, and elite teams keep this small, largely because their changes are small.
- **Time to restore service.** When something does go wrong, how long until it is working again. Elite is under an hour.

That last one is the one I want you to notice, because it answers the question every client is really asking, which is not "will it ever break." Of course it might. Sure, a bug might go to prod. Testing and evals and a good pipeline make that less likely, and make the changes smaller when it happens, but no honest setup promises it can never happen, and you should be suspicious of anyone who does.

The real confidence is this: if a bug does get to production, you find out in moments, from health checks and from a client who is in the room with the system all day, and you fix it in moments. The previous release is still there, so switching back is a switch, not a rescue operation. Or you fix forward, through the same pipeline, and because the pipeline is automated and the lead time is short, "fix forward" means minutes, not a weekend.

That is why small, frequent changes beat big, rare ones, and it is why the DORA numbers matter even for a team of one. A solo builder with a real pipeline, real tests, and an eval set can operate at the elite end of those four measures. A bigger team deploying by hand once a month cannot, no matter how many people they have. The measures do not care about your headcount. They care about your pipeline and your habits.

And this is what lets me let a client steer. A change they propose goes in as a pull request, the tests and evals run, a human reviews it, and it deploys the same way everything else deploys. If it turns out to be wrong in production, we are not in trouble, we are in a routine. We switch back, we look at what happened, and very often that failure becomes - you guessed it - a new test, and a new eval case, so that particular thing cannot quietly happen again.

## Feature flags: deploying is not the same as releasing

One more piece that sits right next to CI/CD, and it is a simple one, but it changes how safe a release feels.

A feature flag is a switch around a piece of new code. The code can be merged and deployed to production with the switch off, which means it is sitting there, in the real system, and nobody using the system can see it or is affected by it. Deploying and releasing become two different decisions, with time in between them if you want it.

You do not need a special platform for this. Whatever framework you are building in will have an option for it: Laravel has Pennant, Rails has Flipper, and most other stacks have a library that does the same job, and there are services that will run the switches for you if you would rather have a dashboard. For most systems I build, the library in the framework is enough to start.

The way it gets used in this package looks like this. A new feature goes through the normal path: pull request, tests and evals, deploy, with the flag off. Then we turn the flag on for just us - my account, the client's team, a QA account - and use it in the real production system, not a staging copy of it. The automated checks can run against the flagged path too, so production itself gets tested, with real data and real infrastructure, while the public is still on the old path.

If that looks right, we turn it on for a small segment: one client site, or a small percentage of users, and we watch it there. Then, when it has earned it, we turn it on for everyone.

And if it has not earned it - if something is wrong, or the client tries it and says this is not what we meant - turning it off is flipping the switch back. No redeploy, no rollback of the release, no scramble. The code stays deployed and dormant, we fix what needs fixing, and we try again. That is time to restore measured in seconds, and it is one more reason the DORA conversation and this model belong together.

For the client, this is often the piece that makes the whole thing feel safe enough to actually use. A feature they proposed can be in their hands, in their real system, for them to test and react to, before any of their customers ever see it. Their feedback at that stage is the best kind, because it is based on the real thing, and it feeds straight back into the cycle I described in the evals section.

One bit of discipline to go with it: flags are temporary. Once a feature is fully released and settled, take the flag and the old path out, and note it in the specs. A system that collects old switches and dead paths gets confusing for everyone, including the AI answering questions about it, and confusing is exactly what this whole package is trying to avoid.

## The risks

I do not want to sell this as magic, because it is not, and the risks are real. I would rather name them in front of the client. That tends to build more trust than pretending they do not exist.

**Data access has to be scoped and read-only by default.** Connecting an AI to a client's database through MCP is powerful, and powerful cuts both ways. Read-only. Least-privilege. Only the tables and views they need. Writes are a separate, deliberate decision, if ever.

**Secrets and Terraform state never go in what the AI can read.** Not in the repo, not in the room, not in a prompt. The AI needs the code, the specs, and the shape of the infrastructure. It never needs the keys to it.

**The shared room is a no-sensitive-data room, by rule.** Chat platforms are US-hosted third parties. So we set the rule on day one: no passwords, no dumps of personal data, no sensitive records in chat. The room is for talking about the system. The system itself holds the sensitive stuff, behind its own permissions.

**Client changes only land as pull requests through the gate.** I covered this above, but it belongs on the risks list too, because every incident version of this story starts with someone skipping that step, just this once.

If you cannot do those things, do not offer this yet. If you can - and they are mostly discipline, not new technology - you are most of the way there.

## What this does to the business model

Project fees fit the old model: build it, hand it over, wave goodbye, wait for the next project.

This package does not fit that, because this package wants a relationship. The feedback cycle I described does not run itself. Someone has to tend the evals, keep the specs current, look at the pipeline when it complains, and be in the room when a question turns into a decision.

The clients I work with were already asking for this, I think. I just did not have a name for it. They do not really want a vendor they file tickets with. They want a steward, someone who set the system up right in the first place and is still paying attention to it. That is a retainer, a smaller ongoing relationship instead of a big build and a disappearance. The system keeps getting better at the things they care about, because their corrections keep feeding back into it, and I get predictable work on systems I know deeply, instead of starting from zero every quarter.

## A starter version, if you want to try this

You do not have to build all of it at once. The smallest version I would call real looks like this:

- One repo: the app code and the Terraform, a `specs/` folder you start on day one even if it is only a page, and a `design/` folder with whatever design guide you have, even if that starts as a page too
- GitHub Actions from the first deploy, not added later: tests on every pull request, the production image built in CI, and a deploy you do not do by hand - plus the feature flag library from your framework, so new features can deploy switched off and be released to the client, then a small segment, then everyone
- Five evals, written at the start, from the five questions your client will ask most - and a prompt drafting area, even if that is just a folder in the repo and the shared room
- One shared chat room with your client, with the AI tagged in and connected to that repo, read-only
- One read-only, scoped MCP connection, to the piece of data the client asks about constantly
- The four rules, written down and put in the room on day one: scoped data, no secrets in reach, no sensitive data in chat, changes only as pull requests

That is a full-stack offer. Not a demo version of one. You can grow every piece of it from there, and it will grow, because the feedback cycle starts turning as soon as a real client starts using it.

## The takeaway

I used to think my deliverable was the app.

It is not, and it has not been for a while. I just could not deliver the rest of it without a team and a budget nobody had. Now I can: one builder, good patterns, a real pipeline, and a client who can ask their own system how it works, and why it works that way, and get an answer that comes from the system itself.

The deliverable is not the app anymore. It is the confidence to use it, to change it, and to keep asking it questions, knowing there is a gate in front of production and a way back if something slips through.

If you build for clients, I would start with one small system and try the package on it. Get the repo in shape, get the pipeline running, write the first five evals before you think you need them. You will learn more from one real client using it than from planning a bigger version of it.

Questions, ask below. Topics you want covered, ask below. Thank you.

---
