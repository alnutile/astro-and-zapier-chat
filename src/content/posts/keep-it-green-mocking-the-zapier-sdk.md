---
title: "Keep It Green: Testing Zapier SDK Code Without Hitting the Real API"
date: 2026-08-06
excerpt: "Your vibe-coded app calls the Zapier SDK, which calls a real API. Run that in a test and it's not a test anymore: it needs a key, it costs a call, and it goes red when the wifi hiccups. Here's how to test it without ever hitting the real thing, and the one reminder to give your AI so it always does."
image: "/images/keep-it-green-mocking-the-zapier-sdk/cover.png"
tags: [ai, ci-cd, vibe-coding, testing, zapier, automation]
faq:
  - question: "How do I test code that calls an external API without hitting the API?"
    answer: "Intercept the network underneath your code. Every call goes out over HTTP eventually, so a tool like MSW (Mock Service Worker) can catch that request and answer it with canned data. Your code does not change and does not know it is being tested. No key, no real call, no flakiness."
  - question: "Why not just let the test call the real API?"
    answer: "Because then it is not really a test of your code. It needs a real key, it costs a real call and can hit rate limits, it is slow, and it goes red when the network or the service has a bad moment. None of that means your code is broken, so it makes your checks lie to you."
  - question: "What is MSW and why use it over wrapping the SDK?"
    answer: "MSW, Mock Service Worker, intercepts outbound HTTP requests and returns responses you define. You use it over wrapping the SDK when you do not want to restructure your code for testability. You mock at the network boundary that every call shares, so the code can stay exactly as the AI wrote it."
  - question: "How do I make sure a test never sneaks a real API call through?"
    answer: "Turn on MSW's onUnhandledRequest set to error. If your code hits any endpoint you did not mock, the test fails and prints the exact URL it tried to reach. That way nothing escapes to the real network, and you get a list of every call your code actually makes."
  - question: "How do I get my AI to always write tests this way?"
    answer: "Put the rule in your CLAUDE.md or a reusable skill. State that tests must never hit real APIs, must intercept HTTP with MSW, and must fail on any un-mocked request. The AI reads that file on every task, so it writes tests that way without you asking each time."
---

> **TLDR:** In [part one](/posts/green-means-ship-cicd-with-confidence/) the pipeline ran four checks on every change, and `test` was your regression catcher. But the moment your app talks to the outside world, that check has a problem: your code calls the Zapier SDK, which calls a real API. Run that for real in a test and it needs a key, costs a call, and goes red when the wifi hiccups. Here's how to test it without ever hitting the real thing, and the one reminder to bake into your CLAUDE.md so your AI always does it.

---

In [the last post](/posts/green-means-ship-cicd-with-confidence/) I walked through the pipeline that keeps this app shippable: four checks run on every change, and if any go red, nothing merges. The `test` check is the one that catches regressions, the "it worked last week and now it's broken" surprise, before a user finds it.

That works great until your app starts talking to the outside world. And these days it always does, because half the fun of a vibe-coded app is wiring it into your other stuff.

Here's the exact spot it bites. In an earlier post I built a little agent that syncs my Google Tasks into a to-do app, and it does that through the **Zapier SDK**. The SDK is genuinely nice: you call `createZapierSdk()`, grab a connection, and fire an action, and Zapier handles all the OAuth, the token refresh, and the API quirks across its 9,000+ apps for you. That is the whole reason to use it. In code it looks about like this:

```ts
import { createZapierSdk } from '@zapier/zapier-sdk';

const zapier = createZapierSdk();
const { data: connection } = await zapier.findFirstConnection({ app: 'slack', owner: 'me' });
const slack = zapier.apps.slack({ connectionId: connection.id });
const { data: channels } = await slack.read.channels({});
```

Run that in a test, though, and it falls apart. It needs a real Zapier key. It makes a real call that counts against your limits. It's slow. And it goes red any time the network hiccups or Zapier is having a slow morning — none of which means *your* code is broken. A check that lies to you is worse than no check, because you stop trusting the red.

So here's the question: **how do you test code that calls an API without calling the API?**

## Two ways, and I like the second

**Option one: wrap the SDK.** Put the SDK behind your own little function, then swap in a fake version during tests. It's clean, and it's the "proper" answer. But it means writing your code to be testable up front, and honestly, when I'm vibe-coding I don't want to stop and tell the AI to wrap and inject everything. I just want to say "build the sync" and still end up with a good test.

**Option two: take over the network.** This is the one I reach for. No matter how deep the SDK call is buried in your code, and no matter how messy the AI left things, that call still goes out over HTTP in the end. So you intercept it *there*, underneath everything. The code doesn't change. It doesn't even know it's being tested. That fits how I actually work: let the AI build the thing however it wants, and mock the one seam every call has to pass through anyway.

## Faking the network with MSW

The tool for this is **MSW** (Mock Service Worker). It quietly takes over the HTTP layer and answers requests with whatever you tell it:

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  // catch the SDK's call and hand back canned data
  http.all('https://*.zapier.com/*', () =>
    HttpResponse.json([{ id: 'g-2', title: 'Call bank' }]),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

> NOTE: MSW isn't the only tool here, and it's worth knowing why I land on it. The classic Node pick is [nock](https://github.com/nock/nock), but it hooks Node's old `http` module and doesn't catch the native `fetch` that modern SDKs (the Zapier one included) run on. Node ships its own answer, undici's [`MockAgent`](https://undici.nodejs.org/#/docs/api/MockAgent), which does catch `fetch`, but you wire it up per-dispatcher. MSW patches `fetch` itself and matches on the URL, so it catches the call no matter how the SDK makes it. That's why it's the one I reach for when I don't want to think about the transport.

Then the test runs your real code, and your real code calls the SDK, and the SDK's request never leaves the machine:

```ts
test('syncs new tasks, skips ones already saved', async () => {
  const db = fakeDb([{ external_id: 'g-1' }]);   // g-1 is already saved
  await syncTasks(db);                            // calls the Zapier SDK inside
  expect(db.inserted).toEqual([{ external_id: 'g-2', title: 'Call bank' }]);
});
```

`syncTasks` didn't get wrapped or rewritten. It calls the SDK like it always did. MSW just sat underneath and caught the request.

## The one line that keeps it honest

One setting up there does the real work: **`onUnhandledRequest: 'error'`**. That's the whole game.

It means if your code calls any URL you *didn't* mock, the test fails right there. So nothing ever sneaks out to the real network. And you get a running list of every call your code actually makes — including the ones you forgot were in there.

And it lines up with how vibe-coding actually goes: **you don't have to know Zapier's internal URL up front.** Run the test once, let it fail, and MSW prints the exact address the SDK tried to reach. You copy that into a handler and you're done. The tooling tells you what to mock. You didn't have to go read the SDK's source to find out how it talks to Google Tasks under the hood.

> NOTE: Make your canned data real-shaped by recording it once. Hit the real API by hand one time, save the JSON it returns as a fixture file, and feed that to MSW. Now your fake data isn't something you made up, it's the real shape, so your mapping code gets tested against reality.

One more thing worth saying plainly: what you're testing here is *your* code, not Zapier's. You trust the SDK does its job. What you care about is your logic around it, the dedupe by `external_id`, the field mapping, what happens when it gets an empty list back. Keep a single real test that actually hits Zapier if you want, but gate it behind a flag and run it nightly, not on every change. That one's an early warning for "did Zapier change something," which is a different job from the fast checks that gate every merge.

## What you're really building

I keep landing on this one lately, and it's not really about testing at all.

I could not tell you how the Zapier SDK talks to Google Tasks under the hood. The exact endpoints, the auth dance, none of it. And I didn't need to. The AI wrote the sync. MSW told me the URL when the test failed. I mocked it and moved on.

What mattered wasn't knowing how any of it works. It was knowing to **remind the AI of one rule**: tests never hit real APIs, mock the network, fail on anything un-mocked. That reminder is the skill now. The AI can write the code all day. Knowing the handful of guardrails to hand it is the part that's on you.

And you only say it once. Drop it into your `CLAUDE.md`, the same file the pipeline mirrors as its Definition of Done, so it rides along on every task and every project:

```md
## Testing
- Tests must never hit real external APIs (Zapier, Supabase, etc.).
- Intercept all outbound HTTP with MSW and fail on any un-mocked
  request (onUnhandledRequest: 'error').
- Record a real response once, save it as a fixture, and mock with
  that so the shape matches reality.
```

Now every feature you vibe-code that reaches out to the world gets tested this way, without you thinking about it. You set the guardrail once and the `test` check holds it. Better yet, drop that same rule into a **reusable skill** and it follows you from project to project, so a brand-new repo starts out already knowing how you like your tests written.

That's how the check stays honest and stays green: it tests your code, offline, every time, and never leans on a key or the weather.

Green means ship.

## Want to go deeper?

- **[MSW (Mock Service Worker)](https://mswjs.io/)**, the network-interception library, with docs for Node and the browser.
- **[nock](https://github.com/nock/nock)** and **[undici's `MockAgent`](https://undici.nodejs.org/#/docs/api/MockAgent)**, the other two well-known ways to mock HTTP in Node, if you want to compare.
- **[Zapier SDK](https://docs.zapier.com/sdk)**, connect your app to 9,000+ apps without building the OAuth plumbing yourself.
- **[Part one: Green Means Ship](/posts/green-means-ship-cicd-with-confidence/)**, the pipeline this `test` check lives in.
