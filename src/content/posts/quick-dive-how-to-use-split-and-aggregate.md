---
title: "Quick Dive: How to Use Split & Aggregate Nodes in n8n"
date: 2025-09-07
excerpt: "When it comes to building workflows in n8n, there are a few nodes that don’t get the spotlight they deserve — but once you master them, you’ll find yourself using them almost everywhere."
image: "https://substackcdn.com/image/youtube/w_728,c_limit/m6GwIIDR-oc"
tags: []
faq:
  - question: "What do the Split and Aggregate nodes do in n8n?"
    answer: "Split breaks an array or result into individual, loopable items. Aggregate combines multiple items back into a single payload you can send forward. They are the pair you reach for whenever you are working with lists of data."
  - question: "Why would I aggregate data before sending it to an AI model?"
    answer: "So you call the model once instead of many times. Instead of hitting ChatGPT five separate times, aggregate the items and send them in one request — like asking it to summarize all your task items at once. It is cheaper and cleaner."
  - question: "When should I use Split versus Aggregate?"
    answer: "Use Split when you need to loop over items one at a time and process each result individually. Use Aggregate when you need to bundle many items into one payload to send onward. Most real workflows use both together."
# original_url: https://substack.com/home/post/p-173008338
---

The workflow is [here](https://gist.github.com/alnutile/0847b02bb72f006a8ad4b9280e3ec5ff)

Two of my most used

- 
**Split** 🪓 → break down arrays or results into individual, loopable items.

- 
**Aggregate** 📦 → combine multiple items into a single payload you can send forward.

In my latest video, I walk through some *practical, real-world use cases* for both nodes. Consider this article a quick reference guide to go along with the tutorial — and yes, I’ll link to the actual workflow templates at the bottom so you can explore them hands-on.

### 🧩 Why Split & Aggregate Matter

n8n is powerful, but working with multiple items can get messy:

- 
You don’t want to call an say ChatGPT **5 times** when you could aggregate the data and send it once into the LLM with all the data. “Summary all the task items for me”

- 
You don’t want a single structured array from AI output; you want to **split it into usable pieces** for loops. “Split the content.results”

- 
At the end of a workflow, you don’t always want 20 “done” messages — sometimes a single aggregated “done” trigger is exactly enough.

The Split and Aggregate nodes handle these scenarios beautifully.

### 📌 Example Use Cases

- 
**AI Summarization** – Use **Aggregate** to pull multiple rows from a database into one payload, and send it into an LLM in a single query. No wasted tokens, no repeated calls.

- 
**Loop Closures** – At the end of a multi-step loop, apply **Aggregate** so you trigger one clean email or update instead of spamming your system five times.

- 
**Structured AI Output** – Split arrays from LLM responses into individual items that can be processed one by one (tweet them, send them in Slack, etc).

- 
**APIs at Scale** – After hitting an API that returns large nested data, use **Split** to isolate the exact objects you need, and loop over them for further work.

- 
**Combination Workflow** – Sometimes, you’ll Split to process results and then Aggregate to return a single concise record (e.g. returning one “quote” from multiple options).

### 🎥 Watch the Full Walkthrough

This Substack outline is meant as a supplement. To really see these nodes in action with live demos, check out the full video:
👉 

### ✅ Final Thoughts

Don’t sleep on Split and Aggregate — they’re foundational building blocks for making your workflows **smarter, cleaner, and scalable**. Once you know how to use them, you’ll start noticing places where they can save you time and simplify your automation.

🔥 Then your Substack readers can click through to workflows, and when people watch your YouTube video you can comment, “Hey, I broke this down in an article + linked the workflows here 👉 [here](https://gist.github.com/alnutile/0847b02bb72f006a8ad4b9280e3ec5ff)
