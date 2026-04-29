---
title: "The Event-Driven AI Stack: Supabase + n8n (Video Companion)"
date: 2025-12-02
excerpt: "*This is a companion note to my latest YouTube video. You can watch the full breakdown here: https://youtu.be/rDN3m2qs58I*"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/rDN3m2qs58I"
tags: []
# original_url: https://substack.com/home/post/p-180469544
---

#### ****Support the work ⚡ [Supabase Sponsor Link](https://supabase.link/OsjrOBv)****

> 
👇 Workflow links below

Most “AI Automation” tutorials teach you to poll APIs. You set up a cron job to check a database every minute: **”Is there new data? No. Is there new data? No.”**

It works, but it’s fragile, wasteful, and slow.

In this video, I break down a better way: ****Event-Driven Architecture**** using Supabase Webhooks and n8n. This allows your AI agents to react instantly—the millisecond a user uploads a file or saves a draft.

Here is the technical breakdown of the two patterns we built.
### **Pattern 1: Storage Events for RAG 📂**

The goal: User uploads a PDF → System automatically ingests it into a Vector Store.

Instead of watching a folder, we use ****Supabase Storage Webhooks****.

1.  ****Trigger:**** A file is uploaded to the `documents` bucket.

2.  ****Event:**** Supabase fires a `POST` request to an n8n webhook.

3.  ****Action:**** n8n grabs the file, chunks it, embeds it, and stores it in your Vector Database (which is also Supabase/Postgres).

This transforms a complex “file watching” script into a simple, reactive workflow.
### **Pattern 2: Database Events for AI Agents 🤖**

The goal: User creates a “Recipe Title” → AI writes the full recipe, tags it, and generates an image.

We use ****Database Webhooks**** on the `blog_posts` table.

1.  ****Trigger:**** A new row is inserted with `status: draft`.

2.  ****Event:**** Supabase sends the payload (including the Row ID) to n8n.

3.  ****Action:****

*   n8n generates the recipe content using OpenAI.

*   n8n generates an image using DALL-E 3.

*   n8n ****updates the original row**** with the new content and sets `status: published`.

The frontend (if using Supabase Realtime) updates instantly before the user’s eyes.
### **The Stack / Links**

**⚡ [Supabase Sponsor Link](https://supabase.link/OsjrOBv)**

🚀 [N8N Workflows](https://www.newsdailyai.studio/#tab1))

Rag Workflow 👉 [Cole Medin’s Channel](https://www.youtube.com/@ColeMedin)

If you are building internal tools or AI backends, stop polling and start listening to events. It’s cleaner, faster, and scales with you.
