---
title: "Evaluate Your RAG System with N8N"
date: 2025-07-25
excerpt: "Automate Testing of your RAG/Chat System with N8N"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/EgWJiTV45AA"
tags: []
# original_url: https://substack.com/home/post/p-169232996
---

The video is below, with a more in-depth  write up as well.

I will go over some of it below and of course share the workflows and spreadsheets below!

In my latest video, I tackle a problem that many of you have asked me about: how do you *really* know if your AI chatbot is any good? It’s a huge challenge, especially when you’re not a domain expert in the content you’ve fed your bot.

I ran into this exact issue myself. I needed to be sure my chatbot was giving accurate and helpful answers, but manually testing it with hundreds of questions just wasn't practical [[01:08](http://www.youtube.com/watch?v=EgWJiTV45AA&t=68)]. That’s why I turned to my favorite workflow automation tool, N8N, to build a system that does the heavy lifting for me.

In the video, I walk you through the entire process of building an automated evaluation system for a Retrieval Augmented Generation (RAG) system [[00:06](http://www.youtube.com/watch?v=EgWJiTV45AA&t=6)]. Here’s a quick overview of what I cover:

- 
**The Problem with Manual Testing:** I start by explaining the core problem: it’s incredibly time-consuming and difficult to manually test a chatbot's performance, especially when you're not an expert in the subject matter [[01:08](http://www.youtube.com/watch?v=EgWJiTV45AA&t=68)].

- 
**Automating with N8N:** Next, I show you how I used N8N to automate the entire process, from generating questions and answers to evaluating the results and summarizing them with AI [[02:09](http://www.youtube.com/watch?v=EgWJiTV45AA&t=129)].

- 
**Generating Realistic Test Data:** A key part of the process is generating high-quality test data. I demonstrate how to use AI to create user questions and system answers directly from your content, like PDFs [[03:40](http://www.youtube.com/watch?v=EgWJiTV45AA&t=220)].

- 
**Running the Evaluation and Analyzing Results:** Once the test data is ready, I show you how to run the evaluation in N8N and review the scores and reasoning for each answer [[09:50](http://www.youtube.com/watch?v=EgWJiTV45AA&t=590)]. The system can even provide tips for improving your RAG system's prompts [[12:54](http://www.youtube.com/watch?v=EgWJiTV45AA&t=774)].

- 
**Empowering Builders:** My goal with this system is to empower business owners and solo developers to ensure the quality of their AI systems without needing a team of machine learning experts [[17:25](http://www.youtube.com/watch?v=EgWJiTV45AA&t=1045)].

This automated approach allows for continuous testing and improvement, helping you fine-tune everything from your data chunking to your system prompts.

For a full, detailed walkthrough, be sure to check out the [video](https://www.youtube.com/watch?v=EgWJiTV45AA).

### A Deeper Dive: The Blog Version

For those who prefer to read, here’s a more detailed breakdown of the concepts I cover in the video.
#### Chapter 1: Why RAG Evaluation is Crucial

Before we get into the "how," let's talk about the "why." I built my system using a technique called Retrieval Augmented Generation, or RAG. At its core, RAG helps prevent AI "hallucinations" by forcing the model to retrieve information from a specific knowledge base (like your company's documents) *before* generating an answer.

But just because you have a RAG system doesn't mean it's perfect. Is it retrieving the right information? Is it summarizing it correctly? Answering these questions is the goal of evaluation.
#### Chapter 2: The Limits of Manual Testing

When I first started, my instinct was to test the system myself. I'd ask a question and check the answer. The problem? I already know the material! I'm the domain expert. I needed to know how the system would perform for a user who *isn't* an expert.

The alternative—coming up with hundreds of potential questions and manually grading each one—is incredibly time-consuming and doesn't scale. This is the bottleneck I wanted to solve.
#### Chapter 3: Automating the Process with N8N

This is where workflow automation comes in. I used N8N to build a multi-step workflow that automates the entire evaluation process. In the video, you can see my exact workflow, but here’s the high-level logic:

- 
**Generate Data:** Automatically create a list of questions and "ground truth" answers from my documents.

- 
**Test the System:** Feed the generated questions to my RAG chatbot and record its actual answers.

- 
**Evaluate:** Send the question, the ground truth answer, and the chatbot's actual answer to an AI model (like GPT-4) to act as an impartial judge.

- 
**Store Results:** Save the scores and the reasoning behind them in a Google Sheet for analysis.

This creates a repeatable, scalable testing process that I can run anytime I make a change to my system.
#### Chapter 4: Generating High-Quality Test Data

Arguably the most powerful part of this system is its ability to generate its own test data. Instead of me thinking up questions, I have an AI read my source documents and generate questions and expected answers.

This saves dozens of hours. To see the specific prompts I use for this generation step, you can jump to in the video.
#### Chapter 5: Analyzing the Evaluation Results

With the workflow running, my Google Sheet quickly fills up with evaluation data. I designed the sheet with several columns:

- 
**The Input Question:** The question that was asked.

- 
**Expected Output:** The "ground truth" answer generated from the document.

- 
**Actual Output:** What my RAG chatbot actually said.

- 
**Graded Quality Score:** A score from 1-5, given by the evaluation AI.

- 
**Reasoning:** A written explanation from the AI on *why* it gave that score.

In the video, I walk through some real examples from my sheet, showing you how to interpret the scores and spot areas for improvement.
#### Chapter 6: Getting AI-Powered Insights

Manually reading through hundreds of rows of evaluation data is still a lot of work. So, I added a final step: an AI-powered summary. I feed the entire evaluation sheet to another AI and ask it to summarize the results, identify patterns (e.g., "The bot struggles with questions about pricing"), and even suggest improvements to my system prompts. It's a massive time-saver.

This automated process empowers anyone, from solo developers to business owners, to build and maintain a high-quality AI chatbot without needing a dedicated data science team.

I hope this detailed breakdown is helpful! For the complete visual guide and to see the system in action, be sure to watch the full video.

### Paid Section

For my paid subscribers, I’m sharing the exact n8n workflows I used to build this automated evaluation system. You can find them below.

Here is the [Gist](https://gist.github.com/alnutile/bcf945b224d7814e673d6c7b655065f4)

Here is the [spreadsheet](https://docs.google.com/spreadsheets/d/1fPgVQZGIgLLc_eNy1Mfmv_pfHGW1yYGpWSJCmFHbR1A/edit?usp=sharing)

---POSTBREAK---

