---
title: "🤔 What if I was to build it now"
date: 2025-06-26
excerpt: "This in the first article I write back in Nov 2024 when I stumbled upon n8n. It made me really rethink how I would approach customer solutions from that day on!"
image: "https://substackcdn.com/image/fetch/$s_!GjMv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fca4702ff-dfab-4847-af3c-0b763d75c3f8_1024x1024.png"
tags: []
# original_url: https://substack.com/home/post/p-166280949
---

Listen to NoteBookLM talk about the article [https://readorlisten.com/episodes/what-if-i-was-to-build-it-today](https://readorlisten.com/episodes/what-if-i-was-to-build-it-today)

I have been a developer for 25 years. Since the breakthrough of AI and tools like ChatGPT, Claude, Bolt.new, Cursor Ai, N8N.io, FlutterFlow, Bubble.io and more, it’s hard for me — someone who has built applications for companies of all sizes, from Pfizer to NextChapters (a one-person startup) — not to step back and rethink: “What are the right tools for the job?”

I can no longer say Laravel for all things web, nor can I ignore the low-code, no-code solutions that are now, more than ever, accelerated by these tools.
> 
*“I can no longer simply say Laravel for all things web, nor can I ignore the low-code, no-code solutions that are now, more than ever, accelerated by these tools.”*

Keep in mind that I have done really well with Laravel since 4.2, spending a number of years building applications and platforms on it at Pfizer. So, I am grateful for all it has done for my career.

How do I look at each job, including my hobby projects, and decide how to approach it? Let’s dig into standard builds customers ask me for and some ideas I’ve wanted to explore myself. I’ll share how I would have approached them two years ago versus how I’d tackle them today. These are all actual builds and projects for clients.

I think we’ll see that it’s no longer Laravel alone — more often than not, it’s N8N combined with something else.

So, let’s take a look.
# **Email Opt-Out System**

About a year ago, a customer received thousands of “opt-out” requests they had to process. With a backlog of emails waiting to be opted out, I reached for my handy toolkit of Laravel and even Filament!

With those tools at the ready I got the emails from the box, parsed the horribly formatted text for the name, address, phone and email to option out (why would they offer me an API that would be two easy!), and a day or two later we had a system that would check for new emails ever so often, then it would add them to the optout list and start the process of opting them out. Now, there was an LLM integration already happening in this project as more email formats came in so I used an LLM to grab the text we needed out of it and change it to JSON which will add to this “What if I was to build it now” question
## **Cost of that work**

The above work involved another site, another database to track all that information, and another codebase to maintain, and it took two days to complete.
> 
*“I have to look at this paradigm shift and decide how to make it work for me and my clients — and when. There is no ‘if’ in there, in my opinion, no matter the size of the client.”*

If I were to do this today, I would log into n8n, which the customer has set up. All my customers now have this setup so that even little things become easy, like “Slack notices about weekly Trello tickets closed” or “Latest news about client XYZ,” etc. In that workspace, I would point it to the email box. In that case, it would react to every new email. Then, as the email comes in, I would add a Basic LLM to the workflow with an Output formatted so that I would be 100% confident in the JSON coming out of it. Then, I inserted that output into the database. From there, I would run a node that records in that database to be opted out and then send an email to the client. Finally, it would update the Google Sheet to log the update. Google Sheets was better than a database since it is a UI I can hand to staff to monitor and review. Since N8N integrates into so many services, it took just a few clicks to get it done.
## **Cost of that work**

Since this work would use the existing n8n install I have for that client, adding those nodes to a workspace about 2–4 hours.

[

![](https://substackcdn.com/image/fetch/$s_!GjMv!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fca4702ff-dfab-4847-af3c-0b763d75c3f8_1024x1024.png)

](https://substackcdn.com/image/fetch/$s_!GjMv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fca4702ff-dfab-4847-af3c-0b763d75c3f8_1024x1024.png)

# **Water Registration Project**

This was a big project and a good example of something that will most likely be me saying Laravel + N8N. In general, it had a signup process that did some latitude and longitude searches to decide if you qualified, followed by a backend with numerous scheduled operations and automation, such as turning handwritten reports into data.

If I were to do this now, I would move about 50–80% of the Backend into an N8N backend. Not only would the Backend be easier to support for me and any other developer who comes into the work, but this is a great example of a project starting out as one thing and becoming another as you work with a customer to build it out.

In this case, for example, I could not have written all the logic to take a PDF, run it through an LLM/OCR, and then extract the structured data I needed for Lab results. Instead, I could have clicked on a few nodes and had an N8N Webform that takes the form, does all that work, and saves it to the database.
> 
*“Yes, I like to code, but for me, it is not an end in itself. It is a means to an end: to build something — something for me, something for my clients, and more importantly, help them make or save money.”*

And then any scheduled tasks like daily checks on followups I could have just had running in N8N instead of building both the scheduled automation in Laravel and then using Filament to show that the scheduled tasks are running (or yes, use some library)

It is difficult to put a number on the backend work saved; again, I am willing to say 50% of my time is saved.
# **I am not an Artisan any more than my Toyota Prius car mechanic is**

Let me stop for a moment and touch on a subject. Yes, I like to code, but for me, it is not an end in itself. It is a means to an end: to build something — something for me, something for my clients, and more importantly, help them make or save money. So, I know this entire concept puts people off because it does not respect the act of coding and being an artisan.

I have to look at this paradigm shift and decide how to make it work for me and my clients and when. There is no if in there, in my opinion, no matter the size of the client since they are hiring me to build something that makes or saves them money.

If I can, with just a few clicks, build an API that supports their needs and allow other developers they hire or who work with me to come in and easily update, then that is a huge win for everyone.
# **Recent RAG Project**

Another project I would like to consider is a recent RAG chat system. Let’s set aside the fact I was not “allowed” to use my open-source LaraLlama Laravel-based RAG system due to the company’s internal service that was required. But instead let’s see how it would look if I “What if I was to build it now”

This project has a pretty standard chat interface. Yes, it was made nice with branding, but overall, it is a chat interface with filters we all know by now. The Backend is vanilla Filament for the most part. And then there are a lot of HTTP-based calls to their non-ChatGPT compatible API.
> 
*“One more side thought here is that all these new options I am talking about give me superpowers when it comes to solving a problem. Projects I would have avoided in the past due to the unknown unknowns, I can now take on, knowing that I should end up with a good solution.”*

This project had about 200 documents to vectorize and an interface to let users upload and tag documents. Of course, the chat interface with a UI to show sources and citations and save those was also included.

Setting aside all the custom work, I would say using Filament, Laravel, and if we could use normal ChatGPT API would take 2–4 weeks of worktops.

But “What if I were to build it now?” To begin with, I would consider using an off-the-shelf open-source web solution like Open-WebUi,but since I know that clients with budgets rarely want a solution they can not alter, that leaves me to think more of a flexible solution. Let us look then at this in a few layers.
## **Front End Chat**

The front end for the user could have been built in bolt.new and Cursor Ai 1–2 days. So, assuming that is true and not including all the “move that button there, add that button there, etc. Then, for the API to handle the requests, I would use N8N and its integration with ChatGPT. Sure, I could just make requests from the code (though being what it is, Streamlit or a Node-based site since these AI tools seem to default to those technologies), but as I noted above, the no-code low code approach means less support. So, not only is it a time-saving option upfront, but think later on as well.

We can then focus on the Backend.
## **Backend upload documents**

So we used Filament here, and even though it is “template” like code in that it is driven by great docs and consistent patterns of code, it is still a lot of code and sometimes can leave you a bit stuck until you learn how to think like it. Considering the customer wanted a ui for uploading documents and giving them meta-data, I could have built it with the bolt.new and cursor.ai; I will even do it for a video soon.

Sign up here: 

https://videos.dailyai.studio/

 to get notified when I do so.

I would set up the Backend to talk to N8N so it would do the heavy lifting of storing documents, sending them to the rag system when approved, and so forth. And if we were lucky enough to control the RAG part of the system, I would use its built-in tools to build that part out.
# **Time Saved**

So, not even considering the long-term savings that come with less code to maintain, I would say here that other than the unpredictable customer changes. I would say easily 80% saved in the backend and front end.
> 
*“Imagine needing a quick tool that allows a user to upload a customer feedback file, which is then analyzed for sentiment and trends — N8N can automate this entire workflow, making it highly efficient and easy to manage.”*

# **On a side note, Ai does not default to PHP**

Before I show another example, let me point out one more thing that is making me look at other solutions: that none of these tools seem to default to or do that well in writing PHP. For whatever reason, Python and JavaScript / TypeScript come out of these tools like water from a glass I spill on my laptop, unlike PHP, which is more like when I try to circle things in MS Paint using my mouse. It is not so cohesive. It just is what it is in my experience.
# **The new superpowers it gives me**

One more side thought here is that all these new options I am talking about give me superpowers when it comes to solving a problem. Here are some projects in the past I would have avoided even though I had an interest in them due to the unknown unknowns, which typically means lots of money lost. However, due to the abilities these tools give me, I can take them on, knowing that if I steer them right, I should end up with a good solution.

One project was a GIS project, and ChatGPT just walked me through all the data conversions, even writing out the scripts for me.

Another was a Chrome extension that integrated with an application I made for the client. Two years ago, I hired a developer to do it; this time, I built it myself in two hours!

And recently, Playwright. I needed to scrape some data for a client, legally, of course, and I always knew this would be a powerful choice, but I did not have the time to jump into it. But two Cursor AI prompts later, I was done! No kidding.

So, I am able to take on a wider variety of work and lean on my experience as a developer to know the questions to ask and when things are getting pear-shape!
# **Recent Pipeline Project for Simple UI to Reporting Apps**

This example is not so much “What if I was to build it now” since it is a new undertaking, but I was able to say, “How would I build it now.”

The customer wanted a “factory” to build out sites that are a nice UI to upload a file and return results. The logic is really in the prompt we give the LLM that then takes the file and runs the prompt against it’s data. Some examples are “Marketing Analytics,” “CRM Questions,” etc. Each ui has a purpose, but they are all the same. I would have pushed Laravel all the way for this in the past, but now, no.

Now I see with Bolt.new, Cursor, and N8N, we can easily spit out nice-looking user interfaces that then send the file to N8N to process and return results. For example, imagine needing a quick tool that allows a user to upload a customer feedback file, which is then analyzed for sentiment and trends — N8N can automate this entire workflow, making it highly efficient and easy to manage. Less code, less debt to manage later on, less overhead when a new developer has to build out one for a new use case, etc. Sure, we could have built a multi tenant Laravel system with some ui to easily build up a new domain, form, and flow, which I have done before, but when you bring in the next dev, when you think long term hosting, support of code and security, and just taking advantage of these tools that I have no doubt are here to stay and save me time, then it becomes less the choice. We end up with a simple TypeScript or Steamlit ui talking to our N8N backend.
# **My Saas Factory**

Let’s set aside the many Saas products we experience in the Laravel community; they are very niche in how they are products for us by some of the influencers in the ecosystem. But for me and any new Saas idea that I want to “Build a little, Learn a lot,” I would have to say my go-to is going to be either Bolt.new+Cursor using N8N as a backend or FlutterFlow and N8N. Why? Overall, it has been hard to learn FlutterFlow, but I am already seeing the advantages of its templates and components. And as I noted in the superpower area, it is not about knowing Dart. It is more about knowing what I do not know and what I need to ask for. So I no longer feel stuck using a new technology like it. Also, I liked the video of one of the people from Flutter Flow 

 about it not being about no-code.
# **Where does this leave me?**

Years ago, I had a moment when I saw Drupal and PHP no longer being the right choice for me. I started using Ruby on Rails and did well there. Then, seeing Laravel and missing PHP, I returned to that and all the batteries it had that day, including composer, cloud drivers, etc. So, once again, looking at the technology road in front of me and a new fork in the road, I think that it might be another time for me to consider how to change with the times. In this case, it is not all or nothing but just a lot less of the “Build” and more of the “Measure and Learning” that these no-code, low-code AI and LLM-empowered tools are bringing to my toolbox.
