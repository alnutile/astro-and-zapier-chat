---
title: "My Favorite Ai Feature Unstructured data to Structured"
date: 2025-10-15
excerpt: "This one aspect of ai has helped me solve numerous customer problems with no-code or in some cases solving something code could not have solved."
image: "https://substackcdn.com/image/youtube/w_728,c_limit/TpfI3sim0L8"
tags: []
# original_url: https://substack.com/home/post/p-176192530
---

***👉 Get the workflow https://dailyaistudio.softr.app/#tab1***

I just dropped a new YouTube video on a topic that I think is one of the most practical and powerful features of modern AI: **taking unstructured content and turning it into structured data.**

For months, this has been a game-changer for the systems I build for my clients. We used to need a ton of custom code and complex parsers to handle this, but now we can just use AI. It’s faster, surprisingly reliable, and opens up so many possibilities.

In the video, I walk through a few real-world examples, showing you how to take messy, unstructured content from emails, web research, and even images and convert it into clean, structured JSON that you can plug right into a database or any other part of your workflow.

Let’s dive into some of the highlights.
#### **Example 1: Processing Meeting Notes from an Email**

The first thing we tackle is meeting notes. Imagine getting an email with a summary of a meeting. It has a title, a TL;DR, action items, and a list of who needs to follow up. It’s all just a block of text.

With the **AI Agent** node in n8n, we can feed this text to a model like GPT-3.5 Turbo (you don’t always need the latest and greatest!) and use its “Structured Output” feature. This is where the magic happens.

I show you how to define the exact JSON object you want as the output. You specify the fields you need—like `title`, `tldr`, `copy`, `who`, and `follow-up`—and even define their data types (string, array of strings, etc.).

The AI takes the messy email text and neatly organizes it into this structure.

The best part? You can now take this clean object and directly insert it into a database. No more manual data entry. It just works. I also touch on the “Auto-Fix” feature, which is a neat addition that lets the AI seamlessly retry if it doesn’t get the structure right on the first try.
#### **Example 2: Extracting Data from Images and PDFs**

This one has been a huge win for my clients. They often have handwritten notes, invoices, or forms that they’ve scanned or taken a photo of.

In the video, I show a workflow that:

- 
Pulls an image (like a photo of a handwritten note) from Google Drive.

- 
Uses the **Analyze Image** feature of the ChatGPT node to “read” the image.

- 
Prompts the AI to extract the relevant information and format it as a JSON string.

Now, this first step gives you a string, not a usable JSON object. So, I show a simple but effective trick: I chain another AI node (a basic OpenAI node works great) to take that string and properly parse it into a clean JSON object. It’s a two-step process that is incredibly reliable.

Think about it: all the code, testing, and unpredictability this would have required in the past just melts away.
#### **Example 3: Automating Research and Handling Lists**

The final example is one I really enjoy: using AI for research. You can set up a workflow to automatically research a topic, like “news about no-code tools,” and structure the findings.

The key difference here is that we want a *list* of results, not just a single object.

So, in the “Structured Output” tool, I show you how to define your output as an **array of objects**. Each object in the array represents an article and contains fields like `title`, `summary`, `url`, and `tags`.

Once the AI returns this array, you can use n8n’s core nodes (like **Split In Batches**) to process each article individually—save them to a database, send them to a Slack channel, or anything else you can imagine. It’s a powerful way to enrich, structure, and act on data.
### **Watch the Full Video to See It in Action**

These are just the highlights, but the video goes into the nitty-gritty of setting up the nodes, writing the prompts, and handling the data. If you’ve ever been frustrated with manual data entry or wished you could automate the processing of documents, emails, or images, this is for you.

And of course, here is the workflow from the video that you can download and play with yourself.

https://dailyaistudio.softr.app/#tab1

Hope you enjoy it and that it helps you solve some of your own data challenges!

---POSTBREAK---

