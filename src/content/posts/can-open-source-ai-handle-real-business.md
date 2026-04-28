---
title: "Can Open Source AI Handle Real Business Work?"
date: 2026-01-19
excerpt: "I start testing open-source models on common business prompts and data to see which ones are the best for which tasks."
image: "https://substackcdn.com/image/youtube/w_728,c_limit/TrIP0lW23-4"
tags: []
# original_url: https://substack.com/home/post/p-185028925
---

The site is **https://localaibench.com **and The video is here 

# Phase 1 Results - Open Source Models vs Real Business Tasks

Alright, this is the first batch of results and I just wanted to get something out there because it’s been taking forever.

The whole point of this: can open source models actually handle common business work? Taking meeting notes and turning them into action items. Reading emails and pulling out what matters. Turning messy documents into structured data. That kind of stuff.

Not benchmarks. Real tasks I get asked about constantly.
## The Setup

I’m running everything locally using Promptfoo for evaluation and LM Studio for inference. The models get the same prompts, same test cases, and then I have three AI judges—Claude, GPT-4, and Gemini—scoring the outputs. When all three agree, I feel pretty good about the result.

I’m also including Claude Sonnet as a baseline. So if an open source model gets an 80% and Claude also got an 80%, either my prompts are bad or these models are actually competitive. We’ll see.
## How’d They Do?

Here’s where things stand on meeting notes extraction:

**Doing well:**

- 
Google Gemma 3n (80%, fast)

- 
OpenAI OSS 20B (80%, consistent)

**Middle:**

- 
Meta Llama 3.1 8B (60%)

- 
Qwen 3 (60%)

**Not great:**

- 
DeepSeek R1 (53%)

- 
Mistral 7B (20%)

Now, DeepSeek and Mistral—I’m not sure I picked the best versions. I have some hardware stuff to sort out so I can run the bigger models properly. I’ll come back and retest once that’s fixed. Mistral especially, I hear good things, so I want to make sure I’m being fair to it.
## What I’m Learning

The prompts matter a lot. A bad prompt will tank a good model’s score. So I’m taking it slow, throwing away more test cases than I keep, trying to make sure this actually means something.

I’ve got five or six use cases I want to test—code review, document summaries, email responses, RFP-to-quote stuff—but I’m only publishing meeting notes for now. I want the quality to be there before I add more.
## Check It Out

The results are live at [localaibench.com](https://localaibench.com). You can see what passed, what failed, dig into the details.

It’s not amazing yet, but it’ll get better.

I’ll keep updating as I add more models and more use cases. If you want to follow along, subscribe or check out the video where I walk through the dashboard.

Questions, feedback, whatever—let me know.

—Alfred

---POSTBREAK---

