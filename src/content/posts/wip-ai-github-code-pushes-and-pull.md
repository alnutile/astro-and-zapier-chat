---
title: "WIP Ai GitHub Code Pushes and Pull Requests"
date: 2025-09-19
excerpt: "Template to help with one way of reviewing your code for you with every push of code"
image: "https://substackcdn.com/image/youtube/w_728,c_limit/x7JebstIZHs"
tags: []
# original_url: https://substack.com/home/post/p-174013338
---

👉You can see the video [here](https://youtu.be/x7JebstIZHs).

## Intro (then I will go into detail)

This is a POC I did for the DailyAi.Studio team. This was before we started building more in Softr but still has value with some of our more standalone sites. For example we have an SEO checker which could do more to make sure none of us forget any steps in the process. 

In this workflow a user pushes code to GitHub (or any tool really) and N8N will be triggered. Then we use the “Execute” scripts to run Repomix on that code to hand over the results to different external workflows. One will do the code review, one will do the SEO review, the final one coming back to the main Workflow to create the GitHub Issues. Of course at this point the Issues could trigger agents or tickets on a board for someone or ai to fix!
## Overview Of Workflow

[

![](https://substackcdn.com/image/fetch/$s_!m21D!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f51f9c3-1525-4362-9ef6-a51b8ed8b04f_1105x897.png)

](https://substackcdn.com/image/fetch/$s_!m21D!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f51f9c3-1525-4362-9ef6-a51b8ed8b04f_1105x897.png)

Let’s look at this one part of a time.
## Pulling down the Code

[

![](https://substackcdn.com/image/fetch/$s_!BpMn!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd286edea-1c97-4411-b0c8-7b72f3e9c44e_1103x572.png)

](https://substackcdn.com/image/fetch/$s_!BpMn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd286edea-1c97-4411-b0c8-7b72f3e9c44e_1103x572.png)

Here we get the code from the Pull Request. We then set some variables (you can see this video on how to do that better [here](https://youtu.be/vUaZgr0RFKU).

So then we use the “Execute” node to download the code to a folder that we setup. We even then install Repomix. 

Why [Repomix](https://repomix.com/)? It helps to summarize the code in a way you can hand it over to the llm without taking up all the possible context window. This idea might be a little dated. And honestly the moment I can run some other open source code focused llm here I would just do that.
## Running Repomix and Getting Existing Issues

[

![](https://substackcdn.com/image/fetch/$s_!yIWn!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff1850bfd-6b65-4c4c-ae7a-cc37255835cc_1224x439.png)

](https://substackcdn.com/image/fetch/$s_!yIWn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff1850bfd-6b65-4c4c-ae7a-cc37255835cc_1224x439.png)

## 

Now that we have the code and Repomix we will just get the results from that and gather existing GitHub Issues (since we might make more I want the LLM to see what is there to try and prevent duplicates)
## Plugin Workflows Here

[

![](https://substackcdn.com/image/fetch/$s_!gnua!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F50b4f25c-223d-4f55-ad74-7f5b4b98545f_531x493.png)

](https://substackcdn.com/image/fetch/$s_!gnua!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F50b4f25c-223d-4f55-ad74-7f5b4b98545f_531x493.png)

At this point your team can plug in any tools they want like “Code Check”, “SEO Check” security checking and more. Basically what are the things your team needs to automate. These “rules” are yours and you can use simple markdown files to help keep them available for the LLMs. I even use a Google doc here to make it easier to maintain.

## Convert any issues found into Issues in GitHub

[

![](https://substackcdn.com/image/fetch/$s_!SL57!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F728f5e1f-dfea-4da6-a0d7-9896e00bfa22_992x559.png)

](https://substackcdn.com/image/fetch/$s_!SL57!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F728f5e1f-dfea-4da6-a0d7-9896e00bfa22_992x559.png)

Now we get into the final part of the flow. And this really comes down to prompting. We give it past Issues, results from the other Workflows, and a Structured output pattern to then enable the LLM here to generate “issues”.

[

![](https://substackcdn.com/image/fetch/$s_!Mu8e!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7ac70a76-cca0-40b2-8caa-1fdd3c4002e9_1379x1008.png)

](https://substackcdn.com/image/fetch/$s_!Mu8e!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7ac70a76-cca0-40b2-8caa-1fdd3c4002e9_1379x1008.png)

At this point we return zero or more objects that represent an issue. The resulting issues should look something like this.

[

![](https://substackcdn.com/image/fetch/$s_!W7Qd!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2058b1d8-0062-4aa4-9742-dc5ce071a3b2_1226x733.png)

](https://substackcdn.com/image/fetch/$s_!W7Qd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2058b1d8-0062-4aa4-9742-dc5ce071a3b2_1226x733.png)

With more prompting and work to prevent duplicates. If the user tags them “Fix” then this could trigger the next workflow to do the work.

## Final Part Pull Request Review

The final part will make a nice PR review so you can go about fixing the work.

[

![](https://substackcdn.com/image/fetch/$s_!D9lH!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa8b66b2d-fd4c-440e-98be-9e952d7c98b3_977x456.png)

](https://substackcdn.com/image/fetch/$s_!D9lH!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa8b66b2d-fd4c-440e-98be-9e952d7c98b3_977x456.png)

Remember a lot of this comes down to prompting. You can easily make it yours for your personal code flows and team flows.

[

![](https://substackcdn.com/image/fetch/$s_!TaNc!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F89730f1e-9ab9-4b8f-ae7b-782e6173b6ca_1557x1132.png)

](https://substackcdn.com/image/fetch/$s_!TaNc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F89730f1e-9ab9-4b8f-ae7b-782e6173b6ca_1557x1132.png)

👉The workflow is [here](https://gist.github.com/alnutile/c7fabaad3b2924549cfb83a573f73d47).

---POSTBREAK---

