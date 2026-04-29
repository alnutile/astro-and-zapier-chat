---
title: "Your Own Family~Personal Intranet Open Source"
date: 2026-04-12
excerpt: "I got tired of re-building auth every time I vibe-coded something to solve a small idea"
image: "https://substackcdn.com/image/fetch/$s_!w_Sy!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F759f8b34-3cc2-41d4-828c-8e012aa04305_1546x878.png"
tags: []
# original_url: https://substack.com/home/post/p-193976419
---

Add what you want it is your personal intranet

Every time you vibe-code a little tool, you hit the same wall.

[

![](https://substackcdn.com/image/fetch/$s_!23mB!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F33100664-3e0d-49b9-a74f-3c0447d58bda_1304x2004.png)

](https://substackcdn.com/image/fetch/$s_!23mB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F33100664-3e0d-49b9-a74f-3c0447d58bda_1304x2004.png)
Mobile friendly!

Auth. Database. DNS. SSL. You spend more time on infrastructure than on the actual idea. And then you want your partner to use it too — so now you’re managing user accounts and worrying about security for a *shopping list*.

You do it once for a recipe app. Again for a movie tracker. Again for a bookmarks tool. Three apps, three deploys, three sets of the same boring problems. The thing you actually wanted to build? That was the easy part.

**What if you only had to solve that once?**

That’s the idea. One platform. One login. One deploy. Then you just build little apps inside it — or pull in plugins other people have made.

Your family gets one link, one account, and access to everything you’ve built. Recipes, a watchlist, a shopping list — all in one place, all behind the same auth.

**The AI part is what makes it fun**

The other thing that changes the experience: you don’t type data in. You point AI at it.

Snap a photo of a wine bottle — it reads the label and fills in everything:

[

![](https://substackcdn.com/image/fetch/$s_!lcwH!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F46cc561a-ca07-4667-98b8-e8fd8950fbba_1524x688.png)

](https://substackcdn.com/image/fetch/$s_!lcwH!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F46cc561a-ca07-4667-98b8-e8fd8950fbba_1524x688.png)

Take a picture of a recipe or paste messy text — AI structures it into a proper recipe with ingredients, steps, and tags:

[

![](https://substackcdn.com/image/fetch/$s_!EYHn!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F013b46f7-ccc9-4621-b232-7470244dc507_1504x889.png)

](https://substackcdn.com/image/fetch/$s_!EYHn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F013b46f7-ccc9-4621-b232-7470244dc507_1504x889.png)
For me I wanted Recipes

Type “Severance” — AI fetches the summary, tells you it’s on Apple TV+, tags it as a thriller, and grabs the poster:

[

![](https://substackcdn.com/image/fetch/$s_!TgH0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa978629f-ec0f-4131-9b50-22a94c0e2b0f_1492x881.png)

](https://substackcdn.com/image/fetch/$s_!TgH0!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa978629f-ec0f-4131-9b50-22a94c0e2b0f_1492x881.png)
And Shows!

No forms. No data entry. Just point it at something and go.

**Or just build whatever you want**

The repo has docs that teach your AI assistant how the plugin system works. So you can literally say:
> 
“I want an app to track bookmarks. Use AI to grab the TLDR of each URL and auto-tag it.”

And Claude Code (or Codex, or Cursor) will build it for you — client, server, database, everything — because the platform handles the rest.

If someone else already built what you want, pull it in from a GitHub repo. One click in the admin panel.

**Try it**

It’s open source. Deploy it on Railway (or anywhere that runs Docker) and you’re up in minutes. One server, one SQLite database, all your apps.

→ [https://github.com/alnutile/intranet-platform](https://github.com/alnutile/intranet-platform)
