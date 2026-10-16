---
title: "Giving AI Its Own Desk and Computer"
date: 2026-10-16
excerpt: "Giving AI its own workspace makes browser-heavy tasks easier to hand off. From recovering $1,600 in solar payments to turning a research workflow into an API, here is where agents in a box are useful."
image: "/images/giving-ai-its-own-desk-and-computer/cover-medium.png"
tags: [ai, agents, automation]
faq:
  - question: "What is an AI agent in a box?"
    answer: "It is an AI agent with a working environment that includes a browser, files, and software. Depending on the product, it can also run scheduled tasks, receive requests from applications, and work alongside other agents."
  - question: "Does this replace ChatGPT or Claude Desktop?"
    answer: "I see these systems as an addition to the tools we already use. A separate workspace is useful when a task involves substantial browser work and you want to keep using your own computer."
  - question: "Can an application send work to an agent?"
    answer: "Yes. In the research workflow described here, a webhook lets the main application request data collection from an agent that performs the browser steps and brings the file into our system."
  - question: "Does running an agent locally mean the AI model runs locally?"
    answer: "No. The agent's computer and the model are separate choices. A local agent can still send information to a hosted model provider."
  - question: "Why does model choice matter for a business?"
    answer: "Different tasks have different cost and capability needs. Model choice also helps a business adapt when providers change their offerings and compare results using models from different families."
---

## TLDR

> **TLDR:** Give AI its own desk and computer, then give it a specific job. These environments make it easier to hand off browser work, run recurring tasks, and let other applications request that work through an API. I see them as an addition to the AI tools we already use.

---

Think of it as giving AI its own desk and computer, as if it were a coworker. It has a browser, files, and software to get work done. Then imagine telling it, “By the way, you can also have multiple agents working under you that you can manage.”

That is the idea behind what I’m calling “AI agents in a box.” The desk is an analogy, and the exact setup varies, but the important part is that the AI has a workspace where it can keep doing the work you give it.

[Grok Bot](https://x.ai/news/introducing-grok-bot) describes teams of agents working on a shared cloud computer, while [Muse](https://ai.meta.com/muse/) has its own dedicated computer in the cloud. [Grokked Bot](https://github.com/alnutile/grokked-bot) is my open-source project for running this kind of setup under our own control, with each bot in its own container. Coordinating those bots as a team is still on its roadmap.

You may hear people call these systems a “harness.” That just means the software around the AI model: the interface, tools, and environment that let it get work done.

There are two areas where this interests me: personal use and business use.

## What made it click for me

For me, it was the browser interaction.

Claude Desktop failed numerous times trying to get things done in the browser. Astra crushed some of those same tasks, but sometimes it was in my way because I was using the computer too. On mobile, the experience was hit or miss.

To be fair, it is already amazing that these tools can do this work. But giving the AI its own computer removed another hurdle. It could work in its browser while I continued working in mine.

I see these systems as an addition to the AI tools we already use. Some tasks involve a lot of clicking through websites, gathering information, downloading files, and moving between systems. Having somewhere to send that work is useful.

And once the process works, you can go further. You can schedule it or give another application a way to request it.

## Personal use: recovering $1,600 in solar payments

Our house came with solar panels. We had not been receiving money owed to us for SRECs, or solar renewable energy certificates, and I was not familiar with how any of this worked.

There was a website and a series of support emails explaining the process, but it was not clear. Responses were also slow. By the time an answer arrived a week later, it was hard to pick up the thread and remember what we were waiting for.

That is the kind of detail work that takes energy. You have to go back through the emails, revisit the website, and figure out the next step every time.

I put an agent on it.

It went through the emails, navigated the website, reviewed our contracts to verify the process, and handled the forms and email conversation. That included asking the right questions and answering the questions support sent back.

I let it do the work. The solar setup came with the house, and figuring all of this out myself was exactly the task I needed help with.

Within a week, we had a $1,600 refund.

Now it is set up to monitor the dates when we expect reimbursement and check our bank transactions through Plaid to see whether the payment arrived. Yes, I am comfortable giving it that access. If the payment does not arrive in time, it emails support.

It also checks our electrical bill to make sure we are receiving the monthly credits from the electric company.

What this means is that I have help following through on something I would otherwise have to keep remembering to check. There are emails, contracts, a website, payments, and bills involved. Giving the agent a place to work across those things made a real difference for me.

## Help with the detail work

Another example is some college work I’m doing to get a degree.

The agent helps me go through the class website, gather assignments, and organize what is due when. It helps identify comments and conversations I need to reply to and review my work against the class expectations.

That makes it easier to fit school around a full-time job and still have time for other things.

I have also used this approach to combine information from an event website with travel plans. The information was tedious to gather and organize, but having it brought together made the scheduling much easier.

These are ordinary tasks. They are also tasks that can sit there because I do not want to spend my available energy sorting through all the details.

## Business use: making an API with an agent behind it

A clear business example involved someone downloading FEC donation data for research.

Their routine was to go to a site, apply filters, work through the pages of results, download the file, and put it into our system. They knew how to do it, but they still had to repeat those steps each time they needed the data.

Once they showed the agent the process, it could do that work for them.

Then they took it a step further and enabled a webhook, giving our main application an endpoint where it could send requests to the agent.

What started as a task someone performed in a browser became something our application could ask to have done.

Basically, they made an API with an agent behind it.

This is interesting to me as a builder. A staff member understands a process because they already do it as part of their job. They can show the agent that process, get it working, and then we can connect it to other tools.

The request might come from our application, from Slack, or from a schedule.

“Every Monday, download the data files from this site and upload them to our S3 bucket.”

That is a concrete job someone can hand off. For operations teams and businesses with repetitive browser work, those jobs add up.

## Each employee can have a group of agents

This is what I mean when I say each staff person could have an army of agents.

One agent gathers research data. Another checks for missing payments. Another prepares a recurring report. Another handles requests from an internal application.

Each has a specific job and the context needed to do it.

The employee does not need to invent an entirely new way of working. They can start with a process they already understand and spend time helping the agent do it reliably.

Once that works, the process can become available to the rest of the business through a schedule or an integration.

## The computer can also be a development environment

Giving the agent its own machine has another advantage.

In our case, it was running Linux, so the user could ask it to set up the software we use. From there, they could prompt it to build new features, QA the changes, and ship them through our existing process.

They did not have to first turn their own PC or Mac into a development environment.

That removes a hurdle for someone who understands the business and knows what they want the software to do, but does not want to spend their time setting up development tools.

The same idea applies to other software. If I want help processing a file or editing a video, the agent has an environment where it can install and run the necessary tools.

Yes, my Mac can do those things too. But now I have somewhere to send the task without first arranging everything on the computer I’m using.

## Where the agent runs

Running locally meant we did not have another cloud environment to host and secure. We still had to decide what the agent could access, but the machine was under our control.

If you use a laptop that you close or take with you, a hosted environment has an advantage. The agent can keep working while your laptop is offline. That is part of the appeal of Grok Bot and Muse.

Grokked Bot also gives us the option to host the environment ourselves, including on a cloud machine. Its Tailscale integration gives us a way to reach its webhooks from other devices on our private network.

For this article, I’m assuming you are already comfortable using hosted AI models. Running the agent’s computer locally and running the model locally are separate decisions. A local computer can still send information to the model provider you choose.

From a business standpoint, I see the agent’s permissions as closely tied to the employee’s permissions. Giving someone an agent should not automatically expand what they are allowed to access or do.

## Why model choice matters

OpenRouter is another reason Grokked Bot interests me.

In my opinion, basing all your AI solutions around one vendor right now is risky. Models have limitations, some are expensive, and services go down. New models come out that you want to try. Older models get deprecated when you would have been happy to keep using them.

As a business, I want room to make those decisions as things change.

[OpenRouter](https://openrouter.ai/docs/quickstart) provides access to models from different providers through a common API. That gives us a way to change model choices without building a separate integration for each provider.

I also want to choose the model based on the work. If each employee has several agents, there is no reason to assume every agent needs the same model at the same cost.

Those costs matter as more people start using these systems for recurring work.

Then there are evaluations, or evals: checking how well the AI is doing the job. I consider those a key part of building with AI. When another model is helping judge the results, I want the option to use one from a different model family. I do not want all our judging tied to the same family of models doing the work.

Model choice does not eliminate outages or keep a deprecated model available forever. Changing a model still means checking that it performs the task well. But I want that flexibility built into the system.

## Start with a task you already have

If you want a place to start, try giving Muse a job-search task across Indeed and other well-known job portals it can access.

Tell it what kind of work you are looking for, your experience, and the constraints that matter to you, such as location, salary, or remote work. Ask it to gather relevant openings and explain why each one might fit.

That gives you a concrete way to explore the idea. There are websites to visit, details to gather, and information to compare.

For me, these setups are making it easier to get started. Knowing what is possible is becoming the new challenge.

Someone might recognize that an agent can download a file for them, but not yet realize that the same process can become something their application requests automatically. Or that the agent’s computer can also be a place to build and test a new feature.

Give it a desk, give it a specific job, and see how much of that work you can hand over.
