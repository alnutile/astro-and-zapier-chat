---
title: "How I built WhatCanWeWatchTogether"
date: 2025-06-15
excerpt: "Behind the Scenes of WhatCanWeWatchTogether.com — Bolt+N8N+Supabase"
image: "https://substackcdn.com/image/fetch/$s_!juvu!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5f57b455-9a03-41f5-b4e9-82ec9b38438a_2176x1810.png"
tags: []
# original_url: https://substack.com/home/post/p-165996070
---

# **How I Built**

# **WhatCanWeWatchTogether.com**

I wanted to share how I built [WhatCanWeWatchTogether.com](https://whatcanwewatchtogether.com/) — a simple site to help people find shows they might both enjoy watching together. While there’s still plenty of detail work to do, the core concepts are in place and it’s working well enough that others (and I) can use it and start the feedback loop.

In this post, I’ll walk through the key parts of the stack, what went well, what didn’t, and where I’m heading next.

## **Bolt.new vs Cursor**

Since this was part of a hackathon, I decided to give [Bolt.new](https://bolt.new) another try and really commit to using it throughout the build. I’ll be honest — I was a bit hesitant. My experience with Lovable was rocky, and I hadn’t touched Bolt in a while.

My first instinct was to force Bolt to use **Next.js** and **Supabase**, only to run into a UI wall where Bolt wouldn’t let me combine the two — claiming it couldn’t support that pairing 🤷🏻.

So I let go. I started over and simply asked Bolt to use Supabase as the backend and let it take the lead on everything else.

**Why Supabase?**

Because I knew I needed:

- 
**Real-time functionality**

- 
**Row-Level Security (RLS)**

- 
**Built-in auth**, including social logins

Supabase checks all those boxes. And this time, by letting Bolt do its thing, I ended up with this:

[

![](https://substackcdn.com/image/fetch/$s_!F5Mv!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F615c55d6-550a-4ad7-8a75-cd3e827fb87a_2176x1810.png)

](https://substackcdn.com/image/fetch/$s_!F5Mv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F615c55d6-550a-4ad7-8a75-cd3e827fb87a_2176x1810.png)

I was genuinely impressed. The UI came together quickly, and I felt like I was making real progress. While Cursor (and my “rules-based” approach) has been stable and solid, it hasn’t yet delivered the kind of “magic” I get from Bolt.new or Lovable. With Bolt, I got both solid UI generation and the structure I needed to go beyond a basic landing page.

We’ll see if that holds up in future projects — but so far, so good.

## **Real-Time User Interactions**

One of the core experiences I wanted was **shared decision-making**. When someone sends a list to a friend, they should both be able to interact in real time — deciding what they’re both up for watching.

[

![](https://substackcdn.com/image/fetch/$s_!llCI!,w_1456,c_limit,f_auto,q_auto:good,fl_lossy/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffb63606f-9d6f-4d2a-a0bc-02bec9283d50_180x320.gif)

- 

](https://substackcdn.com/image/fetch/$s_!llCI!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffb63606f-9d6f-4d2a-a0bc-02bec9283d50_180x320.gif)

I still need to improve the labeling. Instead of confusing “like” buttons, I’ll be switching to more descriptive options like:

*Willing to Watch*

- 
*Already Seen*

- 
*Meh*

That way, the app can build a list of shows that both people are willing to watch together — which is the whole point.

## **TMDB API Integration**

Bolt’s integration here felt almost like it read my mind. The app pulls from the TMDB API to show search results with posters, metadata, and titles.

[

![](https://substackcdn.com/image/fetch/$s_!vpJC!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F09bcef4e-e1c8-4253-8104-a78e086f8f74_2048x1014.png)

](https://substackcdn.com/image/fetch/$s_!vpJC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F09bcef4e-e1c8-4253-8104-a78e086f8f74_2048x1014.png)

It came together really well. This API is not just for browsing — I later use it for show recommendations based on each user’s likes and dislikes later on.

## **N8N, Supabase, and a Bit of AI**

For the AI portion, I’m using [N8N](https://n8n.io) to orchestrate things, rather than weaving it directly into Bolt or writing custom code. This keeps things flexible and lets me debug and adjust easily.

In this setup:

- 
Supabase emits **row-level events**.

- 
A **Webhook in N8N** is triggered on certain status changes (like a button click).

- 
N8N processes the logic — checking whether a user has submitted enough shows or is new.

- 
N8N updates Supabase → and the UI updates automatically thanks to Supabase’s real-time sync.

[

![](https://substackcdn.com/image/fetch/$s_!Rq58!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F60452c82-ac27-45b8-94a2-ef9b75b5eaa5_2326x1032.png)

](https://substackcdn.com/image/fetch/$s_!Rq58!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F60452c82-ac27-45b8-94a2-ef9b75b5eaa5_2326x1032.png)

Then I hook up Supabase and N8N here

[

![](https://substackcdn.com/image/fetch/$s_!TC_r!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F53e37462-f510-4392-8513-2e64428ae09d_3656x1472.png)

](https://substackcdn.com/image/fetch/$s_!TC_r!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F53e37462-f510-4392-8513-2e64428ae09d_3656x1472.png)

Supabase Realtime on and RLS

[

![](https://substackcdn.com/image/fetch/$s_!pBLo!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3b3ebe79-d569-4328-b59e-b7f87bd5c375_3674x1582.png)

](https://substackcdn.com/image/fetch/$s_!pBLo!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3b3ebe79-d569-4328-b59e-b7f87bd5c375_3674x1582.png)

This method gives me the flexibility to evolve the AI/logic flow independently from the app code and keeps the system modular.

## **Deploying with Coolify**

For deployment, I use [Coolify.io](https://coolify.io). I just connect my GitHub repo, plug in the GitHub App Bolt created for me, and I can deploy with a commit in under a minute.

Once things settle, I’ll set up a staging branch that auto-deploys to a test site. When I’m ready, I’ll merge into main and push live.

In the past, I leaned heavily on feature flags. For now, while I’m still learning the ins and outs of Bolt and the Vibe coding environment, I’m taking a simpler and safer approach.

[

![](https://substackcdn.com/image/fetch/$s_!jyOI!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff003157d-e6f4-49be-a0bd-d881e3628553_1752x1922.png)

](https://substackcdn.com/image/fetch/$s_!jyOI!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff003157d-e6f4-49be-a0bd-d881e3628553_1752x1922.png)

## **What’s Next?**

There’s a lot to improve, thanks to early feedback and just using it myself.

Here’s what’s on my list:

- 
Replace the confusing “like” buttons with clear *Willing to Watch* or *Not Interested* tags.

- 
Show more info about each show when choosing — so people aren’t guessing.

- 
Add **social login support** to make onboarding smoother.

- 
Reduce layout jumpiness during list updates.

And of course, polish the AI show suggestion system to feel even more personalized and collaborative.

## **Final Thoughts**

This has been one of the most fun and functional hackathon builds I’ve done in a while. Between Bolt.new, Supabase, N8N, and some AI smarts, I’ve been able to build something I actually want to use — and can iterate on quickly.

If you’re curious or want to suggest features, feel free to try it out at [WhatCanWeWatchTogether.com](https://whatcanwewatchtogether.com/). And if you’re working on similar tools or building with Bolt, let me know — I’d love to swap ideas.

---POSTBREAK---

