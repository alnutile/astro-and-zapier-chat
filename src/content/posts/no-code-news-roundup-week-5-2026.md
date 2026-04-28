---
title: "No-Code News Roundup - Week 5-2026"
date: 2026-02-06
excerpt: "n8n critical security patch, OpenAI Frontier, Microsoft Copilot agent mode, Ollama GLM-OCR, Crawl4AI trending, and cool finds from my X bookmarks"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/jzKaR8neLtM"
tags: []
# original_url: https://substack.com/home/post/p-187131811
---

*This week in no-code news: n8n has another critical security patch — 9.4 severity, patch now. OpenAI launched Frontier, their big enterprise AI agent platform — interesting, but maybe not for us yet. Microsoft’s rolling out agent mode in Word, Excel, and PowerPoint this month. Ollama dropped GLM-OCR for local document understanding and added web search to their API. Crawl4AI hit number one on GitHub trending. And I’ve got some cool finds from my bookmarks this week — a no-code GUI for fine-tuning LLMs, a 3B model that two of the biggest web scraping companies are using to parse millions of pages a day, and more. Let’s get into it.*

If you rather watch go to 

## Platform Updates

### n8n — CVE-2026-25049

It seems every week I start with the n8n critical security patch. These happen and it’s good. Everybody’s on top of it. CVE-2026-25049, go patch your stuff. Just keep an eye on it. Keep an eye on the news and get it patched. The sooner the better. It will be applied to one and two, so there’s no need to jump to two just yet.

[n8n CVE-2026-25049](https://thehackernews.com/2026/02/critical-n8n-flaw-cve-2026-25049.html)

## Tools That Empower Regular Workers

### Claude Desktop Cowork Mode

Now for more interesting or fun news. Again, Anthropic, Claude Desktop Cowork mode. Some of this stuff is maybe a little older than a week, but they are grabbing my attention. I want to bring them here.

Cowork mode brings agentic AI to non-developers through Claude Desktop. Users grant Claude access to folders and it autonomously reads, edits, and creates files — document formatting, file organizing. If you look at their page, there’s some really interesting examples of how to use this. Basically you’re giving the computer, in a secure way, access to your desktop and things you do, especially in the browser.

So before long, you’d have a folder that says, this is how I make reports for my boss. Take these reports, go in the browser, go into our ticket system, grab all the data and make a report. And you just couldn’t do that before as easily. So it’s really a big step forward for tooling that allows normal people to get their job done and empowers them to do it. Really good stuff. So Claude Desktop — download it, get Cowork mode and give it a go.

[Claude Desktop Cowork Mode](https://claude.com/blog/cowork-research-preview) | [My Substack article on Cowork](https://open.substack.com/pub/dailyaistudio/p/claude-desktop-into-it-really-is)

### MCP Apps

Another Anthropic bit of news is the MCP Apps. Again, that one’s not particularly this week, but it’s been getting more buzz on my radar.

Basically MCP Apps extend the Model Context Protocol with interactive UI components. So dashboards, forms, visualizations. Basically while you’re chatting with AI, you get these interactive elements — color choosers, charts, forms. So you’re bringing the UI into the chat. And it’s really a big deal because we’re trying to figure out how to create new applications and rethink UI. So this is one of the angles I think is gonna win. MCP Apps — give it a look and start considering it if you’re building a new UI or building something for your company.

[MCP Apps](http://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)

### Microsoft Copilot — Agentic Features Rolling Out

Microsoft is rolling out agent mode in Word, Excel, PowerPoint in February for Copilot Chat users. New features include notebook grounding for agents, Excel enhancements for locally stored workbooks. No-code Copilot Studio lets non-technical staff build custom agents without coding.

Looks good, sounds good. If you have to use the Microsoft ecosystem and your company will let you use these tools, that’s great. Hopefully it works out well. I hope this doesn’t limit people in what’s possible. I don’t have access to these tools, but it looks interesting — anything to automate and create this kind of cohesive environment with your data, with your tools is so key.

[Microsoft Copilot January 2026 Updates](https://techcommunity.microsoft.com/blog/microsoft365copilotblog/what%E2%80%99s-new-in-microsoft-365-copilot--january-2026/4488916)

### Vercel Agent Browser

Vercel launched Agent Browser in January. It reduces irrelevant context by 93% compared to Playwright — which is another way to basically drive a browser — compatible with Claude Code, Gemini, Cursor.

These agent browsers are very important. A company that might have a test suite of UI interactions with their website could use this now to prompt their way to QA and coverage, which in the years before was a lot of Python, a lot of Gherkin and other things to basically do testing. You can download this, run it in a way that’s part of your CI/CD workflows and do other automations obviously in research for free. That’s really neat, especially if you’re using local models.

[Vercel Agent Browser](https://github.com/vercel-labs/agent-browser)

## OpenAI Enterprise — Is It Important?

### OpenAI Frontier Platform

OpenAI launched Frontier, a new enterprise platform for building, deploying, managing AI agents. Integrates siloed internal applications, ticketing tools, and data warehouses. Includes Enterprise IAM for both employees and AI agents. Wow. Forward Deployed Engineers. It’s a lot going on here.

It’s neat. This is good. I haven’t been impressed with OpenAI for a while. This is a nice move into enterprise and if they can really pull this off and get into these systems, then they could be a way to integrate all this data.

[OpenAI Frontier](https://openai.com/index/introducing-openai-frontier/) | [CNBC Coverage](https://www.cnbc.com/2026/02/05/open-ai-frontier-enterprise-customers.html)

## AI & Local LLM Updates

These are important because if you’re here thinking no-code, thinking AI, thinking what’s going on — these are things you could be running locally to save money or to build solutions for your company that are private, predictable, because you’re not gonna have to change them every so many months. And once you get them running, they should just keep running.
### Mistral Large 3

More news around Mistral. A company who’s known to release models that you can use locally — there’s a 24B one that’s Apache 2 license. So who knows what you can pull off there. I have some benchmarks I’ve been doing for just normal business requirements and these are doing fine. There’s a lot you could just get done with these local models.

[Mistral Large 3](https://www.bentoml.com/blog/navigating-the-world-of-open-source-large-language-models)
### Ollama — Web Search API & Structured Outputs

Ollama’s been around since day one. Ollama added web search API, free tier for individuals. Structured outputs constrained to JSON schema and significantly improved GPU scheduling, fewer crashes. I assume this impacts their running locally versions. So if it does, great. Once again, if you’re running Ollama as your server backend for your local or company-driven type interactions with local models, this is great. I’m just glad they’re making strides here. It’s all good.

[Ollama Releases](https://github.com/ollama/ollama/releases)

## GitHub Trending This Week

### OpenClaw

We had OpenClaw, of course, the highest growing open source repository. If you don’t know about it you’ll see it on LinkedIn, Twitter, all the places.

It’s an interesting paradigm shift. As we see a project that runs an agent 24/7, which means you can talk to it over Telegram and other ways to just get little things done quickly. Not just little — organize my emails, help me build up a proposal for this newscast. You can really do a lot with it. There’s different layers of how we’re gonna use AI and that one is a nice one. It’s an interesting one. We’ll see where it goes.

[OpenClaw](https://github.com/openclaw/openclaw)
### Crawl4AI — 58K Stars, #1 Trending

Crawl4AI is trending — a web scraping framework designed specifically for AI agents to crawl and process web documents. Really important stuff.

It looks really good. It’s something I could use to scrape websites for customers, but at no cost. I could just run it on these machines, go get the data, process the data offline as well. No cost. And they could be collecting data, organizing PDFs and other request for work and so much more.

I had this one person who wanted me to get all the documents from a particular government website to then monitor change in their processes and government rules. And it was just interesting — you have hundreds of PDFs. Let’s grab them, process it, make it chat-able, and then look for changes over time. All that stuff could be free now with these type of tools.

[Crawl4AI](https://github.com/unclecode/crawl4ai)

## From My X Bookmarks

These are some X/Twitter things that caught my eye as well.
### Ollama GLM-OCR

Ollama added GLM-OCR to their available models. It can output in JSON and it’s text, tables, figures. So again, just another vision OCR type model that you can do this common task of taking documents and grabbing more than just the text out of it. Really important honestly. One more vision model. That’s nice.

`ollama pull glm-ocr`
### TinySkills — Self-Learning AI Agents

Another one was TinySkills. An agent that autonomously learns new skills by firing eight parallel agents to scrape docs, GitHub, Stack Overflow, and blogs. 100% open source.

Interesting project. All these things are good to keep an eye on, especially if you’re working in a small business and you need to introduce AI but you don’t have the budget. These are some big wins. One Mac, one of these running later — you have all these automations going and you have AI on the machine so you have predictable costs. Be interesting to see once this stuff really takes off.

[TinySkills](https://x.com/Saboo_Shubham_)
### H2O LLM Studio — No-Code GUI for Fine-Tuning

This is H2O LLM Studio. This looks nice. This is a framework and no-code GUI for fine-tuning. As a business, you might need to fine-tune your models, which is intimidating. But if this tool with its graphical interface makes it easier, then once again, it just reminds me of how we’re putting into the hands of the normal business worker and owner the ability to do what then makes this technology applicable for their business needs.

It reminds me back when MySQL was a big deal when I was starting out. Giving someone phpMyAdmin, believe it or not, was amazing. Because then they learned how to do queries and do the data in their own way without having to ask me to do queries. It’s these little steps that bring the tools to the hands of the normal person getting their job done. And that’s cool.

[H2O LLM Studio](https://github.com/h2oai/h2o-llmstudio)
### Schematron-3B — HTML to JSON

Another open source tool. Again, scraping data from websites, organizing it in a way that it’s structured and then storing in your databases as needed. This model helps with that, which is really important actually. Structured data is really important.

[Schematron-3B](https://huggingface.co/inference-net/Schematron-3B)
### Grok Imagine 1.0 — Full Cartoon Generation

This is a cool one. Grok Imagine 1.0, full cartoon generation. It just reminds me of the creative possibilities right now. If you have an idea for a story, what you could do that you could never do before. And even though people think it’s AI slop — I think if you have some stories that you want to then do in this way, it’s really inspiring. I just gotta find the time.

[Grok Imagine 1.0](https://x.com/Framer_X)

## From My Desk

Some stuff I saw on YouTube that’s worth a watch.

**Building Your Own Clawdbot Replica with Claude Code** — This looks really good. I’m gonna try it this weekend. She does a great job of explaining it. Instead of using OpenClaw, you could use Claude Code to automate and be there for you and just go back and forth and just do stuff. I think it could be a more solid solution and in many ways maybe more secure.

[Clawdbot Replica with Claude Code](https://www.youtube.com/watch?v=jGuzXshuFrQ&list=PLL8JVuiFkO9L3rUtSFIShWkf-EfT6qw2l)

**MCP Apps: Claude Just Got the Ability to Build Live Interfaces** — Again, he’s doing a great job on these videos. It’s worth a watch, get a sense of what these MCP Apps are. And then there’s another one where he talks about AGUI. So you have these two frameworks for how to do UI surfacing in a way that hopefully will inspire you to see how you can build your next UI for your business in a way that is just a lot more simple. It’s gonna get you done more quickly.

[MCP Apps Video](https://www.youtube.com/watch?v=yeOtXhVScTw&list=PLL8JVuiFkO9L3rUtSFIShWkf-EfT6qw2l&index=2)

**How to Build Your Dream SaaS Business in 2026** — Simon does a lot of great videos. Here is some inspiring ideas and inspiration to just keep going with what you can build, what you can do. And SaaS products are hard. I could use Replit and crank it out, but then I have to market the heck out of it. It’s just hard, but it’s fun. It could be fun. And if that’s something you want to be inspired about, just go watch the video.

[Dream SaaS 2026](https://www.youtube.com/watch?v=fnOQMT2EYbg&list=PLL8JVuiFkO9L3rUtSFIShWkf-EfT6qw2l&index=9)

That is it for the news. Please follow, comment so I know what you want to hear, and I’ll see you next week or you’ll read next week in Substack. Thank you.

---POSTBREAK---

