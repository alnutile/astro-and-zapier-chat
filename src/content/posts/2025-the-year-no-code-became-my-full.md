---
title: "2025: The Year No-Code Became my Full Stack"
date: 2025-12-28
excerpt: "How I moved from custom code to building scalable, agent-driven applications with n8n, Supabase, and Softrr"
image: "https://substackcdn.com/image/fetch/$s_!vHPn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fde0dcafe-b4df-4db7-9162-82ef05a7737f_2784x1536.png"
tags: []
# original_url: https://substack.com/home/post/p-182756801
---

## **What’s in it for you?**

**- **The Business Owner Reader****: Discover how shifting from custom code to no-code can slash maintenance costs, speed up feature delivery, and focus your resources on profit-generating tools.

**- **The Traditional Coder Reader****: Follow the transition of a “code-first” developer leveraging AI and n8n to handle complex business logic without the overhead of manually maintained backends.

**- **The No-Code Builder****: Learn how to stack tools like n8n, Supabase, and Softr to build professional, scalable, and event-driven applications with zero custom code.

[

![](https://substackcdn.com/image/fetch/$s_!vHPn!,w_2400,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fde0dcafe-b4df-4db7-9162-82ef05a7737f_2784x1536.png)

](https://substackcdn.com/image/fetch/$s_!vHPn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fde0dcafe-b4df-4db7-9162-82ef05a7737f_2784x1536.png)

## The Transition was not Easy

2024 ended with me realizing all my work on an LLM and PHP book ([https://leanpub.com/php_and_llms](https://leanpub.com/php_and_llms)) was wasted in that two key aspects were made so simple by using tools like n8n: LLM switching and building agent-like systems around the idea of tools.

And that is where the no-code tool n8n (though now I realize there is a plethora of options out there like ActivePieces, Sim.ai, Flowise, and more) became hard to deny. My “never no-code” stance changed quickly to “why am I writing this book?”. You can even see some chapters in the book highlight the ability for the no-code tool to quickly whip up an API to connect to any other system. The classic backend that I would normally have used code for.

So what did that mean for my 2025 and AI? And What did that mean for my 2025 and Code?

During the year, it was a struggle learning how to lean on n8n for APIs and loops and more when I knew I could do it in “seconds” with some code. And of course, I still lacked a frontend to do the work that was needed for the user to see and use. I leaned on Laravel Filament for a bit, but most trending news and “success” stories all seem to show NextJS, Vite, or even Python as more common options for AI to output. But still, I was not happy with that one more area of “unknown,” that one more area that I had to deploy and then modify later on when the customer wanted more features or minor updates. Even with my “Read, Write, Listen” pattern in building NextJS with Supabase—where Supabase does all the Row Level Security, Auth, Websockets, and n8n does all the business logic—it still always felt too “risky” to put together a UI that I could feel 100% confident in supporting long term.

Then came the second piece of this puzzle. Actually third, since Supabase really remains key for me to scale and build out a full event-driven system, especially in situations that require scaling demand-wise but also on those on-premise solutions that cannot use Softr.io. Softr.io, though, is the part of the puzzle that did solve the UI uncertainty as it made it so I could easily drag and drop a UI in place, database schema, auth, and even events as it tied into n8n to build out a full application of limitless business abilities.

Yes, AI still plays a key role in these solutions. In many cases, I use it in the n8n workflows to solve business problems that years ago would have been impossible or too expensive to bother with. I have noted before the email opt-out system that will monitor an email box and help make sure we are properly handling support emails coming in as needed. That would have been a near-impossible build years ago, and I tried it in code, which now has been reduced to n8n and a good Prompt for the AI agent.

So that leaves me with a “full-stack,” both UI and Backend, and an Event-driven system that I can build with no-code that I used to build in 2024 with all code.

So what does this mean for the businesses I work for? I mean, them paying me not to code does not seem like a big win, so let’s talk about a few areas that pay off:

- 
Less code to deploy and maintain

- 
Less work and time to build a feature

- 
Less time on security patching

- 
Easier to support backend with execution history and debug mode in n8n

- 
Easier to train new staff on building since all these systems are well documented and visually friendly

- 
Users can help themselves when they need a feature that is something they can drag, edit, or add in Softr UI, Softr Database, Softr Workflows, or even n8n

These six points all lead to more for less for the business when it comes to features, additions, and changes.

More features, and tweaks but less support and security patching. We all saw the NextJS issue recently, and they happen, that is fine. And with the right automations for continuous deployment and testing then sure, a team can push that out easy enough, maybe. But that is still a lot of work and some risk. By working this way we remove all that so we can focus on the goals of the business: “generate tooling that generates profit”.

The “easier to support” is a big one too. How many times has support come in to fox an issue, try to trace in the logs the trail of that issue, find in the code the area it is not working, even with tools like Sentry, and still come up short? Or, like above, find the issue and then have to deploy it? Removing this with the power of execution history and debug state that n8n offers, you get to easily dive into the backend, find the issue, dig into the reason the issue happened, and rerun that same process again!

The last one is “Users-customers, able to add their own updates”. This is, in my opinion, the biggest win for me in 2025 and how I build solutions. The user can at any time try to modify the system to do that little more they need to optimize their workflow to scale with their workload. Once the blocker between their need and my time is removed, we really get to the power of scaling where it matters. Those who know the needs of the business can create the solutions they need.

So now what? 2026 is here and I already have 100% put away the need for code, but as I noted I still do not have a solid on-premise solution for UI. Will it be Budibase, ToolJet, AppSmith, or some other? And will n8n stand against Sim.ai for the more optimized on-premises solution for true agentic tooling? Lastly, where will tools like Xano, Noloco, and others fit into this toolbox that will allow me to continue to make total solutions for customers using no-code and AI to solve problems and build features that we could not have imagined in 2024 or 2025!

