---
title: "Stop Building like it is 2024"
date: 2025-06-27
excerpt: "How to move forward in building software and adjusting every 3 months"
image: "https://substackcdn.com/image/fetch/$s_!sN6P!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F483ba6eb-6a32-4442-921e-33f63a644fd1_2574x1395.png"
tags: []
# original_url: https://substack.com/home/post/p-166977006
---

A lot keeps changing. And honestly, one of the hardest things isn’t keeping up—it’s letting go of what we used to think was the *“right”* way to build.

There was the “right” way before AI became real in our workflows.
The “right” way before tools like **n8n** and **Activepieces** replaced large sections of backend code for me.

The “right” way before I discovered **Bolt**, **Lovable**, or **Cursor**.

So what does the “right way” look like for me now—compared to three months ago, or even early 2024? And how might that impact you?

## The 2024 Shift: From PHP Frameworks to n8n

Back in early 2024, I was still building a custom PHP framework designed to run AI tasks and automations—something that mirrored what **n8n** could do but with full control. It made sense… until it didn’t.

When I really gave n8n a try, everything changed. I moved almost all new development work out of code and into visual workflows. For legacy systems, I shifted to a **queue-based architecture**: the app would push jobs to a queue, and n8n would handle the automation, only reporting back when done. Clean, efficient, and no more reinventing the wheel. The Queue in this case is Supabase and a table that triggers n8n workflows. So so easy and nice.

Around that time, **Lovable** showed up on my radar too. It was slick and promised a lot—but it often got stuck or hit limitations. Same with trying to build out Supabase integrations directly. So I leaned into a trio that did work: **n8n**, **Cursor**, and **Supabase**—and kept things moving forward.

## The Current Stack: Bolt, Coolify, and Doing Less with More

Fast forward to today—things are *lighter*. Easier. I’ve moved most of my interface building into **Bolt**. It’s good. Not perfect, but good. Sometimes I still use Cursor, but Bolt is handling more and more without fuss.

The real magic is in **the pattern** I now follow consistently:

- 
**Authentication**? Supabase.

- 
**Business logic**? Offloaded to n8n via webhooks.

- 
**Database access**? Supabase again, with **Row Level Security (RLS)** in full force.

- 
**UI**? Bolt, focused just on the visual layer.

Stick to that, and suddenly you’re building fast, deploying quickly, and skipping the “big app” fatigue.

So how does this work?

If you make a feature in the ui, say like I am doing for https://uswork.ai/ and that “feature” is user writes a “Job Posting” to a table. then the tool, Bolt or Cursor only has to do that one simple act. And Supabase can manage all the Row Level Security for you RLS (as you work with Bolt and Supabase to get it right)

From there we go into Supabase and add the Webhook Integration

[

![](https://substackcdn.com/image/fetch/$s_!jKDW!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F502815c7-3b82-4cc7-80aa-8c66907759fe_2366x1308.png)

](https://substackcdn.com/image/fetch/$s_!jKDW!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F502815c7-3b82-4cc7-80aa-8c66907759fe_2366x1308.png)

And simple connect it to our N8N Webhook!

[

![](https://substackcdn.com/image/fetch/$s_!bymP!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd4c70c20-cdeb-4d10-a39f-5146a0df7da9_1750x1678.png)

](https://substackcdn.com/image/fetch/$s_!bymP!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd4c70c20-cdeb-4d10-a39f-5146a0df7da9_1750x1678.png)

Now they are connected and able to quickly trigger events in N8N.
## Deploying? I’ve Switched to Coolify

I used to deploy with Netlify. Nothing against it, but it didn’t match this new pattern. Today, it’s **Coolify** all the way. I’ll link to a couple videos below, but here’s the short version:

- 
Add your GitHub repo

- 
Connect the GitHub app

- 
It auto-deploys whenever you make changes in Bolt

You can even set up **preview environments**—I’ll show that in a future post.

The point is: your stack can now go from idea → authentication → automation → database → UI → deploy in a single flow with very little code.

[

![](https://substackcdn.com/image/fetch/$s_!T342!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5539d49-fe94-40e4-a910-d617e65f9d5c_2886x1596.png)

](https://substackcdn.com/image/fetch/$s_!T342!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff5539d49-fe94-40e4-a910-d617e65f9d5c_2886x1596.png)

In Coolify it really is this easy to add your Environment Variables, add your URL, and try Nixpacks to make it “just work” and you are 90% of the time just done. 
I used their [Github Apps](https://coolify.io/docs/knowledge-base/git/github/manually-setup-github-app) to make it easy to auto deploy applications.

## Why This Matters for You

If you're still writing every bit of logic by hand, still spinning up servers for routine data flows, or still avoiding tools like n8n or Supabase because they seem “not serious”—you’re spending time in a world that’s moving fast without you.

I’ve gone from writing code for everything to visually wiring together real solutions.
I’ve watched as AI tools moved from “hype” to *quietly working in production*.
And I’ve learned that when you stop insisting on the “right way,” you start finding the **right-for-now** way—something that’s simple, fast, and gets results.

If you’re building something now, I’d suggest trying the pattern that’s been working for me:

- 
Supabase (auth + database)

- 
n8n (automation + AI)

- 
Bolt (interface)

- 
Coolify (deployment)

Don’t build more than you need. Just start.

Let me know if you'd like links to examples or videos of this stack in action. I’ll be sharing more about those in upcoming posts.

Thanks for reading,
Alfred

---POSTBREAK---

