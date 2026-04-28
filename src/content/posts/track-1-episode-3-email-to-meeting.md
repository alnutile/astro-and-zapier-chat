---
title: "Track 1 - Episode 3 - Email to Meeting Notes with LmStudio, AMD Strix Halo, N8N, Budibase"
date: 2026-01-03
excerpt: "In Episode 3 of our 2026 On-Prem Series, we’re moving from infrastructure to implementation. It's one thing to have a server running; it's another to have it solving business problems like summarizing"
image: "https://substack-video.s3.amazonaws.com/video_upload/post/183375287/525f72f7-b70d-4f00-873f-f4e22b3d116d/transcoded-00001.png"
tags: []
# original_url: https://substack.com/home/post/p-183375287
---

There series is noted here https://www.newsdailyai.studio/youtube

In Episode 3 of our 2026 On-Prem Series, we’re moving from infrastructure to implementation. It's one thing to have a server running; it's another to have it solving business problems like summarizing meeting notes from an email box and turning them into actionable tasks.

In this video, we cover:

Agent Optimization: How to fix slow n8n agents by tweaking tracing callbacks and switching to faster models like OSS 20B.

The "Skills" Architecture: Moving from simple prompts to a "Company Skills" database in Supabase for consistent AI performance.

BuddyBase UI: Building a front-end for your intranet so non-technical staff can edit AI prompts and manage project tasks.

Docker Networking Deep Dive: Solving the 307 Redirect issue by correctly using internal Docker hostnames instead of external IPs/Tailscale addresses.

LM Studio Tweaks: Adjusting context length and KV cache to prevent "mid-generation" crashes.

Hardware & Software Stack:

Hardware: AMD Ryzen "Strix Halo" (optimizing for A-Series APUs).

Networking: Tailscale for secure remote access to the intranet.

Backend: Supabase (Postgres & Artifacts).

Automation: n8n 2.x using MCP (Model Context Protocol) for task management.

Join the Community: This is part of a year-long track for 2026. Members get access to the private Discord, shared n8n workflows, and BuddyBase templates used in these videos.

🏷️ Tags
#OnPremAI #n8n #BuddyBase #Supabase #SelfHosted #LocalLLM #LMStudio #DockerNetworking #AIAutomation #2026Tech #PrivateAI #MCP #ModelContext Protocol #AMDStrixHalo

## Timestamps
0:00 - Introduction & The "Rough Cut" Philosophy
1:00 - Recap: Private LLMs, Coolify, and SSL
1:50 - Exploring Alaris: A Potential Cloud-Managed Pivot?
3:42 - Addressing n8n Speed Issues & Local Processing Hurdles
4:32 - Goal: Email Automation Foundation
6:45 - Using Tailscale for Secure Local Access
8:50 - n8n Optimization: Fixing Tracing & Callback Latency
11:15 - Model Selection: Why OSS 20B for Agent Routing
13:50 - Transitioning from "Prompts" to "Company Skills"
19:00 - n8n 2.0: Managing Artifacts & MCP Tools
23:45 - The Task MCP: Separation of Concerns for AI Tools
27:10 - Optimizing LM Studio: Context Length & Temperature
32:00 - Troubleshooting: Why Bob Didn't Get His Email
40:50 - Debugging the 307 Redirect (Docker Networking vs. Tailscale)
54:00 - Visualizing Internal Docker Networks
58:20 - Setting Up BuddyBase in Coolify
1:01:20 - Building the Skills Editor in BuddyBase
1:06:30 - Ejecting Blocks & Customizing Long Form Fields
1:09:50 - Final Thoughts: Sim AI vs. n8n for Knowledge Bases

---POSTBREAK---

