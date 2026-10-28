---
title: "What Employers Are Actually Buying"
date: 2026-10-28
excerpt: "I spent the last two to three months looking for work, and partway through I started measuring what employers actually ask for in AI agent roles. The search totals lied. The job descriptions told a calmer, more useful story."
image: "/images/what-employers-are-actually-buying/cover.png"
tags: [ai, agents, mcp, hiring, careers]
faq:
  - question: "What do employers hiring for AI agent roles actually ask for?"
    answer: "In a sample of 128 real job descriptions read in full, no framework was required on its own. Only 1 of 128 postings named a single framework without listing alternatives. Employers ask for agent building experience, usually naming a bundle like LangChain, LangGraph, LlamaIndex, or similar."
  - question: "Which agent framework appears most often in job postings?"
    answer: "LangGraph appeared in 44 of 128 postings as required or preferred, just ahead of LangChain at 40 and MCP at 36. The three lead as a group, and most postings that name one name several, so the counts overlap and should not be added together."
  - question: "What skills show up alongside frameworks in agent job postings?"
    answer: "Evals and observability appeared in 87 percent of the postings that named a framework, security and governance in 83 percent, and Python in 84 percent. Docker appeared in 43 percent and Kubernetes in 31 percent, while Terraform was only 7 percent, much lower than an earlier, smaller sample suggested."
  - question: "Why not just count LinkedIn search results?"
    answer: "The totals are not a measurement. LinkedIn caps its displayed counts, the same posting is reposted across locations and recruiters, and keyword matching pulls in unrelated jobs. MCP, for example, also matched maintenance technician roles. Reading the descriptions themselves is slower and far more honest."
  - question: "Does PHP or Laravel show up in AI agent job postings?"
    answer: "Almost never. PHP appeared once in 128 postings, inside a list of languages. My own read is that Laravel still works well as the product layer, with Python agents behind an MCP boundary, but the hiring market is not asking for it by name."
---

TLDR: I spent two to three months looking for work, and instead of trusting the noise on social media I read 128 real job descriptions for AI agent roles, in full, twice over. Employers are not hiring for a specific framework. They are hiring for agent building experience, and they say so plainly, usually with a list like "LangChain, LangGraph, LlamaIndex, or similar." What they ask for around the framework matters more: evals, observability, security, and Python. The full report, with the tables and the method, is here: [What employers are actually buying](https://muse.ai/s/agent-frameworks-job-demand-vs-x-buzz-exs6bxexfxwpexlxo/iGeF0eA0KR4Wbwi0DApAJOvOwK1gE8QMEEP3F88ovDo).

## Why I ran this at all

I started looking for work in the middle of August, and like a lot of people I watched the agent framework conversation online and tried to work out which names were worth learning. The conversation is loud. One framework is declared dead on a Tuesday and essential by Friday, and the loudest signals, posts and likes and stars, turned out to be the least connected to hiring.

So I did the boring thing. I counted job postings on LinkedIn and a few other boards, and then, because the counts bothered me, I started reading the actual descriptions. That second step changed the conclusions, which is most of what this post is about. The search took a while, 137 applications over about two months, and it ended well. I start at BetterHelp in November. Partway through, the research stopped being a map of where to apply and became a list of what to get better at, and I think that second use is the more durable one.

## The totals lied

The first pass was simple counting, and it produced confident numbers that did not survive contact with the postings themselves. LinkedIn caps the counts it displays, so four different frameworks can all show the same ceiling number, which makes any ranking between them an artifact of the display rather than a measurement. Reposts do the rest of the damage. The same role appears under a dozen locations, and recruiters copy each other, so one opening can look like twenty.

Keyword matching is worse. Searching for MCP surfaced maintenance and technician jobs. Searching for the full phrase "Model Context Protocol" surfaced model risk and model validation roles, which are about financial models and have nothing to do with agents. None of this is a conspiracy. It is just what keyword search over job boards produces, and it means the totals are, at best, weather. Directional, maybe. Not evidence.

NOTE: If you take one thing from this section, take this. A search result count is a count of pages that contain a string. It is not a count of jobs, and it is definitely not a count of what an employer is willing to pay for.

## What I did instead

I read descriptions. The first validated pass covered 20 postings in full. The second, on October 28, covered 128 unique US postings from the previous 30 days, 91 from LinkedIn and 37 from company job boards, deduped by employer, title, and near identical text. For each one I recorded whether a framework was required, preferred, one of several alternatives, or simply mentioned, and I kept the excerpts that justified the call.

Two method choices mattered. First, the second pass searched by role, things like "agentic AI engineer," rather than by framework keyword, which avoided most of the false positives. Second, the source mix moved the numbers. Company boards at AI first companies rarely name a framework at all. Only 3 of the 37 board postings asked for one, not counting MCP, while big companies and consultancies on LinkedIn list frameworks as a matter of habit. Any sample that leans on one source will inherit that source's habits, and mine is no exception.

## What employers are actually buying

The finding that held across both samples is simple. Employers do not require a framework. Of the 128 postings, exactly one named a single framework without listing alternatives, and even it mentioned others elsewhere in the text. Everything else reads as a bundle, a set of acceptable examples standing in for a skill the employer actually wants, which is building agents that survive production.

Within that, a leading group is real. LangGraph appeared in 44 of the 128 postings as required or preferred, LangChain in 40, and MCP in 36. CrewAI followed at 18, with LlamaIndex and AutoGen at 16 each, Semantic Kernel at 14, and Google ADK newly visible at 8. LangGraph edging LangChain surprised me a little, and LlamaIndex sitting lower than the first small sample suggested is a reminder of how much a sample of 20 can mislead. The honest summary is that the top three lead as a group, that most postings name several of them, and that treating the counts as separate piles of opportunity would double count the same jobs.

MCP deserves a word of its own, because it is not a framework. It is a protocol, and it shows up differently, usually as a concrete task: build MCP servers, maintain MCP servers, expose tools over MCP. It appeared at enterprises and at AI native companies alike, which almost nothing else did. If there is a single concrete skill in this data, that is the one.

## What shows up besides a framework

This is the part I keep coming back to, because it is where the leverage is. Among the postings that named a framework, evals and observability appeared in 87 percent, security and governance in 83 percent, and Python in 84 percent. The unglamorous work, measuring whether the agent did the right thing and controlling what it is allowed to do, is what employers describe when they describe the job.

The infrastructure numbers corrected an earlier claim of mine. In the first sample of 20, Terraform appeared in 29 percent of framework postings, and I repeated that figure. In the sample of 128 it is 7 percent. Docker is 43 percent, FastAPI 24 percent, and Kubernetes 31 percent. Terraform still matters to me, but as platform depth, the thing that makes the rest deployable and repeatable, not as a headline hiring signal. Small samples produce big percentages, and I would rather correct that here than let it stand.

One more correction, in the other direction. n8n appears in zero of the 128 postings, down from 3 in the first sample, and that is not a decline. The second pass searched engineering roles. n8n lives in operations and automation roles, which this sample did not cover. Absence in a sample is only ever absence in that sample.

## Where my own stack fits

I come from PHP and Laravel, with AWS and platform work, so I read this data with skin in the game. PHP appeared once in 128 postings, inside a list of languages. Whatever I hoped about a "Laravel plus AI" niche, the postings do not support it, and I would rather know that than pitch it.

What does hold up is a shape I already believed in. Laravel is a fine product layer. It is good at the application, the users, the billing, the boring and essential parts. The agents can live behind it in Python, and MCP is a clean boundary between the two, because the protocol does not care what language is on either side. That reading survived the data. The niche framing did not.

## What this turned into

I took the BetterHelp role before the second sample ran, so this research is no longer a job hunt map for me. It reads better as a skills roadmap, and that is how I am using it now. Build MCP servers, because that is the most concrete ask in the data. Get serious about evals and guardrails in Python, because nearly every posting assumes them. Stay fluent in LangGraph and LangChain without marrying either, because employers treat them as interchangeable and I should too. Keep going with Kubernetes and Terraform, as platform depth rather than as a headline.

If you are earlier in the search than I am now, the practical version is shorter. Read twenty real descriptions for the roles you want before you learn anything new. The descriptions will tell you what is actually being bought, and it is rarely the thing the timeline is arguing about that week.
