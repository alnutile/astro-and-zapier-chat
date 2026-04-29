---
title: "Testing OpenAI’s New Open-Weight GPT-OSS Model on Tool Us"
date: 2025-08-10
excerpt: "OpenAI recently released GPT-OSS, a 20B open-weight model you can run locally (or through OpenRouter). I put it through four real-world automation tests — the same ones I’ve used on other open-weight"
image: "https://substackcdn.com/image/fetch/$s_!YR5b!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F12e7384c-c00e-4065-9e65-0f34e2233488_1280x720.png"
tags: []
# original_url: https://substack.com/home/post/p-170638508
---

OpenAI recently released **GPT-OSS**, a 20B open-weight model you can run locally (or through OpenRouter). I put it through four real-world automation tests — the same ones I’ve used on other open-weight and open-source models — to see how it stacks up.

Below is a quick summary of each section from the video, with links so you can jump straight to the part you care about.

[

![](https://substackcdn.com/image/fetch/$s_!hB9g!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb317ce39-edc4-4baf-83c0-eeb7774235a1_2654x314.png)

](https://substackcdn.com/image/fetch/$s_!hB9g!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb317ce39-edc4-4baf-83c0-eeb7774235a1_2654x314.png)

👉🏻 [Here](https://youtu.be/7up1YZhD0c4) is the video I swapped out the original llm with private llms 

👉🏻 [Here](https://youtu.be/VJiu1rPxLzg) is one of the videos that used the original LLMs

### **1. Tool Usage & Agentic Flows**

I tested GPT-OSS with multiple tools in n8n. The goal: see if it could pick the right one, run it, and return useful output. The result? It handled tool usage cleanly and quickly — even better when sub-agents are in the mix. Marking this one a win.

**📍 [[01:32](http://www.youtube.com/watch?v=g6oPkkmTfZk&t=92)] Tool Usage:** The model's ability to use various tools is tested, particularly for web scraping.

### **2. Structured JSON Output**

Structured output is critical for my workflows, and GPT-OSS did well here. I also compared it to Ollama — both passed after adding an extra node in n8n to catch and fix formatting issues. This keeps automation chains running smoothly.

**📍[[02:53](http://www.youtube.com/watch?v=g6oPkkmTfZk&t=173)] Structured Output:** This section examines the model's performance in generating specific output formats, which is crucial for many workflows.

### **3. RAG (Retrieval-Augmented Generation)**

Even without its own embeddings, GPT-OSS performed solidly in RAG setups when given the right context and prompts. As with most models, quality comes down to chunking, embeddings, and low temperature settings. I’d trust it in a production RAG workflow.

📍**[[04:14](http://www.youtube.com/watch?v=g6oPkkmTfZk&t=254)] RAG (Retrieval Augmented Generation):** This part focuses on the model's ability to provide accurate answers when given the right prompts and context.

### **4. Vision (Multimodal) Capabilities**

No built-in vision support here — so no Base64 or PDF inputs. For now, I’m pairing GPT-OSS with other models like Mistral for multimodal tasks. The focus for GPT-OSS seems to be on agentic and structured text workflows.

📍**[[05:27](http://www.youtube.com/watch?v=g6oPkkmTfZk&t=327)] Vision:** The video briefly touches on the model's limitations when it comes to processing images and PDFs.

### **Overall Score**

Strong performance in tool usage, structured output, and RAG. No gains in vision, but no losses either. It drops right into my local AI stack and is worth testing if you’ve invested in hardware or don’t mind using OpenRouter for speed.

📍**[[05:57](http://www.youtube.com/watch?v=g6oPkkmTfZk&t=357)] Conclusion:** The video wraps up with a summary of the model's overall score and its potential impact on existing workflows.

💡 If you want to see exactly how I set this up and the full test results, watch the complete video here → [Full video link]

And if you’re into **AI, automation, and n8n workflows**, you can subscribe to my Substack for the latest tests, setups, and ready-to-use workflow templates.
