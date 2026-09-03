---
title: "Why I No Longer Build With n8n"
date: 2026-09-03
excerpt: "I used to build my back ends in n8n - APIs, background jobs, queue work, AI integration, all of it. Something happened in January 2026 and now I don't reach for it, or for no-code platforms, at all. Here's the walls I hit and what I build with instead."
image: "/images/why-i-no-longer-build-with-n8n/cover.png"
tags: [ai, no-code, automation, vibe-coding]
---

## TLDR

This is about why I think products like n8n and no-code platforms are going to struggle - and it's coming from someone who had a podcast on them, numerous videos, blogposts and even introduced n8n to Pfizer and other companies. Something happened in January 2026 that pretty much changed the game, and I don't know if there's any going back.

---

## Why I chose these tools in the first place

> 🤯 2024 I was trying to figure this out
> [https://laravel-news.com/php-and-llms-with-alfred-nutile](https://laravel-news.com/php-and-llms-with-alfred-nutile) 

So let's talk about why I chose these tools a year or more ago, when AI was first coming around. About three years ago, say, I wrote a book [LLMs and PHP](https://leanpub.com/php_and_llms), and n8n snuck into that book because I went from building with code to building with n8n. And you'll see that it was that moment where I could say, listen: code is debt.

If I write a project and it has code, there's going to be a certain overhead of writing that code. No matter how many libraries I use. Shipping that code, deploying it, maintaining it and whatnot. And to a degree that stayed quite true for the work I was doing.

And when I hit the moments that I'm going to explain here - I don't want to call them edge cases, because I forget the term, but once everything's an edge case, then what is it, right? It still was worth it, because it was better than code, in my opinion, when it came to those factors.

Now, you can still write beautiful UIs and user integrations or applications. But when writing the back end, I was starting to just write it in n8n, or build it in n8n. Back ends, APIs, background processes, queue work - all of it was there. And most importantly at the time, was AI integration.

Integrating to AI was a big deal back then for me. And being a PHP person, it was even scarier, because there wasn't a community around that at the time. And it was just that moment: where do I stick to PHP and code? Where am I gonna go? Is it Python? Is it something else? n8n was pretty awesome at the LangChain and other stuff.

## Then you start hitting walls

So after a year of using it or more, and implementing it in places, I'm like, yeah, it's great. But then you start hitting walls, whether it's n8n or Activepieces or whatever your platform is. These backend systems have their limitations.

Processing large files was a big one. Processing large amounts of data, and rows of data, was a big one. Scaling to numerous traffic, incoming data, can be tedious. Long-running processes, processes that you break down in half and loop through - but you cannot easily have more than one loop in a workflow, because you just run into issues (memory and count).

So I had to work around a lot of these. Anyone who's working in it long enough knows those limitations. And even things in the free version with n8n - sure, you can connect to your Gmail. But when you're writing a workflow that needs to connect to the Gmail of the person using the workflow from a remote system, then yeah, it gets hard. It gets tricky. And I'm sure, again, their paid version offers things, and I'm sure, again, you can do some magic with it.

But these things became a reality. Testing. How do we deploy this without testing? AI's getting amazing at n8n it, too - then I can give AI existing n8n systems and say, go fix what's going on. So there are a lot of moments where it's still working okay. But to be honest, it's because of these reasons I'm removing it as much as possible too.

## What I reach for now

So now let's talk about that. When building a new application, no matter what, do I reach for n8n? Do I reach for no-code platforms like Softr? And the answer is never, no.


> I made a starter template for my projects so getting started is that easy [https://github.com/alnutile/supabse-vibecoding-starter](https://github.com/alnutile/supabse-vibecoding-starter)

Those platforms always had limitations. No-code systems do not have a database that can scale. Airtable just couldn't scale - millions of records, processing JSON and complex data queries, indexing, vectorizing, hybrid search. None of that stuff worked. And so the moment your product would scale is the moment you were stretching the limits of what you could do, and compromising. It just never worked to that point.

![Not Enough](/images/why-i-no-longer-build-with-n8n/notenough.png)

I think these companies are realizing that as well, as they deal with introducing vibe coding and other things to their framework to compensate for the fact that this is a reality.

So when I have a new application, I have templates I can use to build them out. With authentication. Event systems. Storage. Database. I lean on Supabase, but there's so many others out there, Neon and others. The foundation of authentication and permissions is too easy out of the box.

Deploying these things is just too easy out of the box as well. Railway, or Vercel. So many options. Lovable, Replit. I mean, the list goes on. Replit's a great example, too. Why would you choose these no-code tools over a Replit, when you can just have it do these things for you out of the box? Authentication. Build out UIs that are nice and consistent. They don't break, because it can build this stuff. It can test this stuff. And there is not I can not do that here moments.

As far as integrations go and connections, those are great, and many of them are already ready to go. But to be fair, this stuff's getting so easy that you can prompt that in a moment. It's really not that hard so they can't be as much of a selling point anymore to the systems.

So when I have a project that needs a UI or needs to process large files, I would never reach for any of that ever again. I'd rather just have Claude, Open Router, Cursor, OpenAI and some harness and build a Python script that can process the file the moment it hits a Lambda S3 bucket - but it doesn't have to be a Lambda function, because those have their own limitations. So I could just put that in Railway or some other service like Railway that can just run that Python script on an event.

## The translation factor

![Can not do that here](/images/why-i-no-longer-build-with-n8n/cannotdothat.png)

I think in the end these products just can't last, because - if anything - the translation factor between the business requirements and the outcome gets too compromised. When the business requirements are X and clearly defined, and I can give that to Claude and it can build it, then why would you put it through a filter that compromises or alters what's possible?

And that, to me, comes back to the point: **code is no longer debt**. If I can have automations maintaining it. Doing security audits on it. Building it in the background. Showing me - you know, I can do QA still, but doing the QA for me at a level I used to write by hand, because I've always been TDD or close enough.

Now I can have proper CI/CD deploying to production with confidence. Now I know I can roll forward into proper DORA.dev project statistics on my projects. Now I can get back to that kind of pattern. You'll even see a video [here](https://youtu.be/HJqUvb5wl-U) where I'm coding inside of the application, or building features, by just making a card and putting it onto a lane so it builds it.

## n8n is easier to use for the non builder

This is not even a question any more nor has it ever been. The best builders today know the business domain and enough about getting from build to deploy that the transition from business goal to deployed product has zero loss. N8N was never easy to use and bad builders built bad complex too big workflows eg the same spaghetti code I use to build years ago. So this just never was true nor even close any more since we are not longer thinking at the code level but more "what is the business goal".

## Who should still reach for what

![Your Cloud](/images/why-i-no-longer-build-with-n8n/cloud.png)

So, if you're a company or a person struggling with building things, then heck no, never choose these other products. You would choose a Replit, because then you can do the vibe coding and get the CI/CD pipeline out of it, with the databases and authentication already done and clear and working.

Never settle for anything else, like no-code platforms because you're just not going to get that flexibility. You're going to get limitations. Postgres doesn't have limitations other than your budget. I mean, that's the bottom line. You're gonna choose a database like Postgres and never look back, or you're going to add to that database DuckDB etc. You know, you're going to extend it with other databases. You're not going to look back and be like, darn, I can't do this because it's a million rows or 10 million rows. It just doesn't matter. You're not gonna say, I can't do this, because you chose JavaScript.

I mean, that's the thing. So with Replit you can scale, of course, if you have budget. But then, if you're more confident in your company, that knows how to do the infrastructure stuff, the CI/CD, the Azure, the AWS, whatever it takes to bring all these pieces together securely in your own private cloud, or connecting securely from service to service to your cloud - then again, you wouldn't choose Replit necessarily. You would choose just a normal, vanilla type solution that is optimized for your company.

So that every time something's built, Claude or OpenAI or your harness of choice, Cursor, starts off with that particular templated platform that you have to just get going. Not your own Lovable as much as your own established patterns, skills, and methodologies to just build out a good solid system quickly and easily with confidence. And that again, it takes that extra level of expertise. But if Replit's holding you back, then you do that.

## Where I've landed

But yeah, I mean, this is it. This is it moving forward. It means saying, hey, time to move on. And I think, you know, I'm glad I used those things back then. I'm glad I gave up on coding back then. Because now I see I don't need to code to benefit from code. And code is no longer debt, so I get the best of both worlds, to be honest with you.

All right, I just wanted to share that. And hopefully it helps people kind of think this through. If you have any questions, ask below. Any topics you want to cover, ask below. Thank you.
