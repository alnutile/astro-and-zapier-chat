---
title: "What I’d Do If I Were Starting Out as a Developer Today"
date: 2025-08-05
excerpt: "Lessons from 25 years of tech shifts, from building PCs to building No-Code AI workflows, and how you can change your direction now to start taking advantage of this massive paradigm shift."
image: "https://substackcdn.com/image/fetch/$s_!QPrO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F77031e25-e38c-463c-b884-5da5cb8c3528_1536x1024.png"
tags: []
# original_url: https://substack.com/home/post/p-170002668
---

## 🧠 TL;DR

We’re in a shift. A big one. The kind we haven’t seen since the early days of the internet. Back then, it felt like anything could happen. No one had a title for what we were doing, and most of us were learning through trial and error. From Flash Macromedia as a career path to Linux. Just so much was possible, and so much “hype” was making it hard at the time to know what was going to stay.

And today, so many tools are leveraging AI to build applications, no-code tools are even more relevant than ever as they integrate with the latest AI models and make it easy to create almost anything without code. The way we build software is changing — fast. One person can now handle things that used to take a team of engineers in an afternoon. Sometimes with little or no code at all.

So, how do you fit in this moment?

😱New Developer no longer certain of the job market.

😕Senior developer reconsider their tool sets.

😃Product Owner who sees the power of Lovable to prototype!

But here is what has not changed in all of this:

> 
**Businesses pay for things that either generate revenue or reduce costs.** 

Doesn’t matter if you’re brand new, stuck in a giant legacy app, or running a team — your value comes from the problems you can solve, not the stack you use.

What I’ll share here is just what I’ve learned — the mistakes I made, the mindsets I had to let go of, and the tools I’m using now that have helped me build faster and deliver more.

If you're trying to figure out where you fit in this next wave — or how to stay useful while everything keeps changing — I hope this gives you something solid to work from.

## 🦉 Who Am I

So I’ll share how I got here — not because it’s special, but because it might help.

More than 20 years ago, I got my first job fixing PCs at a small shop in California. I was brand new — I think I had just finished reading a “Dummies” book — and on my first day, I forgot to plug in the fan or maybe installed the CPU backward. Either way, it smoked. My colleague saw that and quit on the spot.

But I stayed.

And for a while, that worked. Until USB came along, making it easy to set up printers, and laptops made it so no one wanted PCs. Things changed. That job wasn’t needed anymore. But what *was* still needed — and still is — was someone who could help businesses move faster, save money, or figure stuff out.

After fixing PCs, I started writing internal web apps for one of the guys I built computers for. He ran an insurance business and needed to streamline his staff’s workflow. I stumbled upon Linux, PHP, and MySQL, so I used that to build his software. Then I jumped into Drupal — not really because it was better than WordPress, but I was convinced it was “better” tech.  Again, a mindset that just came too easily to me, and I continue to look back on those moments, wonder why I was not open to it or other options along the way.

WordPress, quirks and all, **makes and saves a lot of companies’ money**. That should’ve mattered more than my preference.

And this is something that’ll show up again and again in this post: I kept mistaking the tools for the goal. I thought *using the right tech* meant I was doing the right thing. But really, the right thing was helping people solve real problems.

Later, after years of building Laravel apps at Pfizer, I became Director there. My team was focused on helping departments spin up internal apps quickly. But I still thought in terms of Laravel, MySQL, and PHP. I kept looking at the problem through the lens of the stack I knew, not the outcome the department needed.  We could easily have been solving their needs with no-code solutions if I were more willing to let go at the time.

For me, now — years later — I’ve gone from Drupal, to Rails, to Laravel, and now to using tools like N8N, Supabase, and AI to build React sites or internal tools. But I still have to remind myself: I’m not marketing the tool. I’m marketing the outcome. And that outcome is removing more and more the layers between the business owner and the idea to make or save money and the means to the end.

About five years ago, I tried n8n, and honestly, I didn’t get it. I was still deep in “code is king” mode. Letting go of that felt like giving up my identity — not just the tool I used, but the thing I was good at. That’s a tricky thing to shift.

Even now, I catch myself doing it. A friend mentioned Pocketbase, and my first reaction was to ignore it, because I already had Supabase working. But that’s not the point. If Pocketbase can help me build something cheaper, faster, or better for a client, that’s the tool I should use. That’s the mindset I’m working to keep front and center.
> 
I’m not the Laravel guy. I’m not the Supabase guy. I’m the person who solves the problem.

And I don’t always get that right. But it’s where I’m trying to stay focused.

Let go of status quo bias. Don’t wrap your identity around the stack.
Ask yourself — honestly — “How best can I solve this for the person in front of me, in a way that saves or makes them money, and doesn’t fall apart six months from now?”

But on that note, you can jump into this moment in time with the skills of being a good listener, knowing what the business needs, and then using the right tools to prompt your way to delivering those solutions. Sure, you will have to learn what questions to ask, but we all did at some point, through trial and error, or by reading, and spending long hours trying to achieve the business goals.
## 🧩 Side Note: The Artisan Illusion

Let me start by rethinking one of the ideas I’ve held onto for years — maybe you have too if you’ve been in this industry a while.

In the Laravel world, we call the CLI tool `artisan`. The message is baked right in: you’re not just a developer — you’re a craftsman—a sculptor. You make clean, beautiful code. You polish.

But here’s what I’ve come to realize:
**That’s nonsense. 😱**

Companies don’t want artisan code. They want working solutions.
They want fewer bugs, faster delivery, and something that can evolve when the business changes.

Nobody hires an artisan plumber. They want someone who shows up, gets it done, and charges a fair rate. That’s it. That’s the job.

And in our world, what used to make us “special” — the ability to build and ship production-quality software — is still valuable, but it’s no longer rare. The scale has changed. Today, one person with the right stack can ship what used to take a whole team.

That shift — from craftsman to solution builder is more true than ever before.
## 💡 Core Realization: It’s Not About the Tools

That question used to be easy. “I build with Laravel. I use Vue or Filament. I write clean PHP.” But I spent years confusing my tools for my values. One example of me finally breaking away from code first was when a client asked me to automate opt-out emails. 

The problem space was simple. Check this email box, every time an email comes in, parse the email for the person's name, email, address, phone, and then find those in the database, hash them out, and reply to the email that you did that. Of course, all the email formats varied, and the reply-to was rarely the one in the from address.  And AI can take this data that was not structured and make it so. But how to do all the rest of it!

My first version was built with what I knew: Laravel + Filament (so we would write the least amount of code). It worked. But it took a few days to get it right. But then the team had to know the code because sometimes new email providers would submit requests, and we had to add that to the configurations, etc. For example, some providers did not have text, just HTML, so then we had to deal with that, etc.

Then I tried building it again, but this time using **n8n and Supabase**. And in under two hours, I had something live. Same outcome. Less time. Easier to maintain.

That was the first time I saw it, even with good intentions, code became debt. No matter how much we tested, or how good the ci/cd was, it never stayed clean. It always got complicated at the edges.

And that’s where I landed code is the last option and for most application it is not right now where I would put the complexity.
> 
Code is Debt

## 🤔How to get started

Getting work, getting ideas, what to build how can you get going?

Start local: help a small business automate or streamline something annoying.

Don’t wait for permission just build it.

We live in a global market, but let’s not overlook the local needs.

Be creative. As you walk around town, shop, and read the news, what can you do to solve a problem that is current and the company does not even realize they need yet?

Here is one, my local barber shop is busy and the phone is ringing, and they have to stop working with the immediate customer to answer the phone, since people still like calling, but if you could show them Elevelabs+N8N answer that phone for $50 bucks a month, they might be blown away! You get free haircuts for life :) But the next gig they are your reference. Solve real problems with the right technology, scratch your itch, but start doing.

Back when the web was still new, I had to convince local farms and shops they needed websites! But at first, I built them for free, and later, I started to charge a fraction of the going price until I finally had my local web shop! Same thing today. 

Find sites like these https://museums.fivecolleges.edu/ and turn them into amazing experiences using AI, threejs, vectorized data for chat, etc, so they can see what is possible.

 Sure, they might not want it, but you learn a lot, including the tools, the customer, and the sales process. And you just built up one more site on your resume!

## 🔨Example Build Pattern I do today

Below is a building pattern I use presently (08-01-2025), and it works well for web apps and even just backend systems that need to do automations.

[

![](https://substackcdn.com/image/fetch/$s_!DcV-!,w_2400,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffafb8666-99da-4fa6-865a-63021280f588_2686x1754.png)

- 

](https://substackcdn.com/image/fetch/$s_!DcV-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffafb8666-99da-4fa6-865a-63021280f588_2686x1754.png)

And either circle can change the tools used, but the focus is the same. So today I would solve the problem in the context of the above mindset.

Let me break this down:

🔵 Left Circle (UI) — I use tools like Bolt.new, Lovable, or even AI-generated code (like V0) when I need to build interfaces.

- 
But the key? No business logic lives here. It’s just a view layer.

- 
🟢 Middle Circle (Supabase / Pocketbase) — This is the heart of the system:

Auth

- 
Realtime events

- 
Row-level security

- 
File storage

- 
Table reads/writes

- 
Whether it’s Supabase or Pocketbase, this layer does all the heavy lifting in terms of state and data access — and yes, AI often writes the tables or queries for me. And the code layer uses the library to talk to the data layer and listen as needed.

- 
🔴 Right Circle (n8n, no-code) — This is where the actual business logic lives.

Automations

- 
AI agents

- 
Scheduled tasks

- 
System integrations

- 
I trigger workflows here based on database events: table insertions, updates, and deletes. Everything complex happens outside of my codebase

🧠 Insight:

I used to code all of this by hand — dozens of controllers, services, jobs, tests, CI pipelines. Now? I glue these layers together in hours, not days.

This diagram isn’t just a tech stack — it’s a mindset shift:

Solve the problem with the least amount of code, time, and long-term support overhead.

There are so many examples of this pattern working in apps I have built for customers and with other developers that I am confident in it. I even use it for chat so that if the front end writes a row to the chat table, Supabase and its webhook to n8n trigger and write back to the chat table the reply with the UI showing it with really good speeds.
## 🤔 Regrets/Hindsight

Just some bullet points of what I would have done sooner and what I will try not to repeat as things keep changing and growing.

- 
Not letting go of my identity as a "Laravel developer" sooner.

- 
Dismissing tools like Postgres for MySQL, n8n, and ActivePieces because they didn’t feel like “real code.”

- 
Confusing the tools as the end in themselves and not the means to an end

My biggest career regret is not doing this sooner. And now that we have been hit once again with a game-changing shift in our landscape, I had to let go. 

One last real-life experience was three years ago or so, I was watching a video on Langchain and Python, and it hit me then that I was in trouble if I stuck only with Laravel and PHP. Even to the point of writing my own LLM PHP book and framework to try and make it fit the paradigm of ai and building solutions. 

But the day I finally dropped all of that was the day I realized my true potential as someone who can help a business solve problems to make or save money, to innovate, to leapfrog other companies in their domain.

I wish I had looked beyond tech like MySQL, nothing wrong with it, but I just got stuck not being open to Postgres and all it can offer with vectorization, GIS, functions, and more, especially wrapped in Supabase. As well as no-code solutions like N8N, Activepieces, Zapier, Make, etc. And I wish I looked at JavaScript and React more instead of just treating it like a UI component system. 

But more importantly, I wish I were better at looking at each new problem beyond my role as a developer and more of a builder who focuses on the end and not the means to that end.

If I had embraced those tools earlier, or more importantly, this mindset, I think I would have built more than I could even have imagined.
## 🛠 Tools / Resources

- 
n8n – Visual automation builder that can replace thousands of lines of glue code.

- 
Supabase – Postgres + Auth + Storage + Events, all out of the box.

- 
Bolt.new / Lovable / Cursor – Great for quickly spinning up frontends while offloading complexity to Supabase. As seen in the diagram above, we prompt the AI to only talk to the database, read, write, and listen.

- 
Any Chat System to help you think through ideas, and help with documentation reading and understanding

- 
Projects in ChatGPT or Claude to build up more context

- 
YouTube - watch and discover, try watching non-developers and how they are building things.

- 
Coolify.io to get going on running n8n and other tools affordably.

## 
📺 Worth Watching
