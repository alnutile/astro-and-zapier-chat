---
title: "Granola.ai and OpenClaw 🦞"
date: 2026-02-06
excerpt: "Example integrations and automations I do with Granola.ai"
image: "https://substackcdn.com/image/fetch/$s_!8gE5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F62b277c1-54f7-4598-a976-329506323cd9_2048x2048.png"
tags: []
# original_url: https://substack.com/home/post/p-187052138
---

At the end of the article I will share how I setup OpenClaw to talk to Granola but for now I just want to talk about the AI notepad Granola and how it is my latest notepad app (I have used note taking apps for 20+ years now). This is not sponsored. I am making a video for them later but this is just me writing about it but I just want to share some strategies on how to use this app. And why it is beating out other apps on my Mac.

[

![](https://substackcdn.com/image/fetch/$s_!ngjx!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F69bc89ee-c182-4424-a04c-d73eb8d373bf_3014x2290.png)

](https://substackcdn.com/image/fetch/$s_!ngjx!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F69bc89ee-c182-4424-a04c-d73eb8d373bf_3014x2290.png)

I will show some automations with Zapier, and in the end OpenClaw. The first one will take sales meeting notes and turn them into a technical project quote based on my quoting prompt/skill and technical knowledge prompt/skills then to go to Attio and make a follow up task to get to the customer. This I will show how you can chat with your Granola notes in Claude which lets you quick take that info and put it into say and Calendar event. Last of course I will show OpenClaw 🦞!

[

![](https://substackcdn.com/image/fetch/$s_!zN-5!,w_2400,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9e835cf8-0677-40b5-8975-b18bce8f0152_1152x617.png)

](https://substackcdn.com/image/fetch/$s_!zN-5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9e835cf8-0677-40b5-8975-b18bce8f0152_1152x617.png)

## **From Meeting to Automations - Generate a Quote**

I want to show how you can use it with Zapier and other automation systems to go from a particular meeting to next steps. And for me, this meant sales meetings where I was in there to get a sense of the technical needs of the company and to then follow up with that meeting later on to say, “Hey, this is what I think it would cost to do this job.”

The nice thing here is when I am in the meeting it “pops” up but not like some apps in an annoying way but it hooks into my calendar to then start the Google Meet and start transcribing.

[

![](https://substackcdn.com/image/fetch/$s_!u92r!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe8d99be8-7e27-4393-883a-40c15e9dbe8a_1514x636.png)

](https://substackcdn.com/image/fetch/$s_!u92r!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe8d99be8-7e27-4393-883a-40c15e9dbe8a_1514x636.png)

Then I can focus on the meeting. I still take notes, I like to write and doodle thoughts and will even save those to the meeting notes, but it does allow me to focus more on the meeting and less on taking notes.
> 
One tip here is if there is an action item just note verbally in the meeting. “Ok so a follow up item is to do xyz” and this can become part of these automations as well.

Ok now at the end of the meeting I drag it into a folder, I can then have automation start. So I have a folder over here called AI Automation Quote.

[

![](https://substackcdn.com/image/fetch/$s_!aoEz!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F453bcf5e-cbfb-419c-8b05-256e1a000cae_800x450.gif)

](https://substackcdn.com/image/fetch/$s_!aoEz!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F453bcf5e-cbfb-419c-8b05-256e1a000cae_800x450.gif)

Basically, I know this type of meeting is something I want to turn into a quote for a job proposal. So by dragging it into the folder it’s going to trigger a quote that uses Zapier and AI to say, “Okay, this is how we like to quote things. Let’s turn this into the style of quote and strategy for quoting that we like, just like that.”

[

![](https://substackcdn.com/image/fetch/$s_!0BvE!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa9411bdd-83b9-4ff4-b72f-9b9153e24674_2292x1838.png)

](https://substackcdn.com/image/fetch/$s_!0BvE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa9411bdd-83b9-4ff4-b72f-9b9153e24674_2292x1838.png)

And so I go right from a meeting to a follow-up item. It even goes further. It makes a ticket in Attio. And now the next person on the team, which would be the manager or me, would just go review it with a deadline, everything.

[

![](https://substackcdn.com/image/fetch/$s_!ZhiD!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2b7b3bc1-aeb0-4c14-aa1a-b06cf74e8920_2488x1716.png)

](https://substackcdn.com/image/fetch/$s_!ZhiD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2b7b3bc1-aeb0-4c14-aa1a-b06cf74e8920_2488x1716.png)

So we can get it right back to the customer as quick as possible or as a team collaborate on tasks. 
> 
I’m going to hook it into Gamma after this to make a presentation so the customer can also kind of see something that is more visually pleasing.

So right away, you can see how we can go from a meeting to a particular automation.
## **Memory and Context for AI and You**

Some meetings are just team meetings around a product we’re working on, a project. And then some meetings are follow-up meetings. So again, we’re building up context from these meeting notes. So now I want to look at how we can use Granola to help us as a team and as an individual continue to build up context and history of conversations. This can even be client meetings. So if you look in Granola you have Folders and those folders become “memory” for you and your team to chat with.

[

![](https://substackcdn.com/image/fetch/$s_!PfN1!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe07245ee-f3bf-4a60-a5da-ad9f183bf58b_800x704.gif)

](https://substackcdn.com/image/fetch/$s_!PfN1!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe07245ee-f3bf-4a60-a5da-ad9f183bf58b_800x704.gif)

But this is where it gets really interesting, part of a business or team making the most out of AI is context (Context, Skills, Prompts). In this case we have a memory hub for our AI to use. We can easily do that in two ways to start. If you look at your AI tool of choice, I will show Claude, you can see here I connect it to Granola!

Here it connects to Granola

[

![](https://substackcdn.com/image/fetch/$s_!aE9F!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5ec5f01b-d928-427d-aca0-855a7002b330_1892x1704.png)

](https://substackcdn.com/image/fetch/$s_!aE9F!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5ec5f01b-d928-427d-aca0-855a7002b330_1892x1704.png)

[

![](https://substackcdn.com/image/fetch/$s_!iro-!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7ae988a7-6750-4ed9-9d4a-ed5fef129c98_2014x2070.png)

](https://substackcdn.com/image/fetch/$s_!iro-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7ae988a7-6750-4ed9-9d4a-ed5fef129c98_2014x2070.png)

Then below moves it into the Calendar

[

![](https://substackcdn.com/image/fetch/$s_!a9Lg!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9a1b34e2-6f83-4bbe-9958-ebc7b05517c8_2014x2070.png)

](https://substackcdn.com/image/fetch/$s_!a9Lg!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9a1b34e2-6f83-4bbe-9958-ebc7b05517c8_2014x2070.png)

You can browse the **Connectors** to find Granola and start using it:

[

![](https://substackcdn.com/image/fetch/$s_!tPO6!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b810682-9d10-4ced-b9aa-7b84f8ff039a_1079x1358.png)

](https://substackcdn.com/image/fetch/$s_!tPO6!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b810682-9d10-4ced-b9aa-7b84f8ff039a_1079x1358.png)

[

![](https://substackcdn.com/image/fetch/$s_!ftiE!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd3ad970e-e8ed-4fc1-9291-90cd7ae8010f_1974x1964.png)

](https://substackcdn.com/image/fetch/$s_!ftiE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd3ad970e-e8ed-4fc1-9291-90cd7ae8010f_1974x1964.png)

[

![](https://substackcdn.com/image/fetch/$s_!4L_C!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e599c5b-c2f6-4013-bfe9-57d7beb1d54e_2496x1358.png)

](https://substackcdn.com/image/fetch/$s_!4L_C!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e599c5b-c2f6-4013-bfe9-57d7beb1d54e_2496x1358.png)

So right away I go from notepad to integration and chatting with my AI all “context” I am building in Granola becomes part of these other places easily!

Then there is the MCP feature. This is coming out soon and I will show how you can connect it to a system that can then, just like the Folder → Zapier, allow you to connect to your notes in other ways and systems.
## **But in the meantime there is always OpenClaw🦞**

So this was easy thanks to the open-source project [https://github.com/proofgeist/granola-ai-mcp-server.](https://github.com/proofgeist/granola-ai-mcp-server)

What this entailed, which continues to show how crazy this OpenClaw idea really is, was me going to the OpenClaw browser and asking it to run this MCP.

[

![](https://substackcdn.com/image/fetch/$s_!a1Im!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F731cbc9d-1282-4309-aefa-a34b8d0d27e7_1950x710.png)

](https://substackcdn.com/image/fetch/$s_!a1Im!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F731cbc9d-1282-4309-aefa-a34b8d0d27e7_1950x710.png)

And!

[

![](https://substackcdn.com/image/fetch/$s_!qz1a!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fedbcc2e2-3cdc-4df5-9230-ed0533bf3dd7_2271x2070.png)

](https://substackcdn.com/image/fetch/$s_!qz1a!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fedbcc2e2-3cdc-4df5-9230-ed0533bf3dd7_2271x2070.png)

Then that was it it could talk to it. This one uses the cache that is on your Mac. There are otherones that actually connect to Supabase using your Granola creds!

[

![](https://substackcdn.com/image/fetch/$s_!Bfh_!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa7440643-a8b1-46c8-a714-93c1e9c09fe6_1394x2256.png)

](https://substackcdn.com/image/fetch/$s_!Bfh_!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa7440643-a8b1-46c8-a714-93c1e9c09fe6_1394x2256.png)

## **Wrapping it up**

So now you can see I can chat and integrate this into any other workflow.

Alright I am going to go shoot the video for this but just wanted to share here something that really does make sense for my day-to-day work needs.

👉 Check it out here [https://go.granola.ai/alfred-nutile](https://go.granola.ai/alfred-nutile)

This is not sponsored but this link will support my work!

Feel free to ask questions or reach out.

---POSTBREAK---

