---
title: "Agents - What are they, Why do you need them, How do they work"
date: 2026-06-13
excerpt: "We hear a lot about agents and they are amazing. And what they can do for us is setting aside a lot of code and work we used to do. But what are they and how do they work? I just want to kind of remove some of the magic so that you can understand what you're really getting into here and how it is not that big of a deal, but it is pretty amazing."
image: "/images/agents-what-why-how/cover.png"
tags: [ai, agents, vibe-code]
---

Back in 2025, there was a lot of work writing tools for agents. And then our agents really were, in many ways, just a long-running node process. Basically, we would send an HTTP request and we would use JavaScript or Python to then pass that JSON to the API of one of the services, OpenAI or Anthropic or so many others. And then with the results it would give us back, we would then analyze if it's a tool call or not. And then we would have all the tools we wrote, you know, how to use HubSpot or the API for SERP API or more. And then those tools would then do the thing, sometimes just deterministic functions, sometimes AI also. And then they would come back and the agent would then take the results and do the next thing. And this works, but it is different than what we're about to talk about now. What we're about to talk about now is giving agents a computer, a sandbox, a place where they can just do their work. And then ironically, they end up with this thing that they use called Bash. Now, what is Bash? Here's a little TLDR on it.  AI, please insert TLDR of Bash here. And as you can see, it's been around quite a while and it's part of the Unix or Linux mentality of all these tools in it that it uses. So we have a lot of tools that will come up. Some of them have the strangest words or names ever. Let me give you a list of some of them.  SED, AUK, GREP, FFprobe. So you can see in this to find some of those just for fun. AI pleased to find some of those tools to make a nice list of tools and what they do. And then they had this concept of piping. So they would take the output of one tool, pipe it to the next one, and so forth, which is really amazingly, not just amazing, simple but amazing. These focus tools will then do that one thing and then return results.  But now, if we give AI these dash and all the tools that are underneath it like FFmpeg which I'm going to use in this video, it can kind of do anything it needs to do for that moment. So what I'm going to show you is two example things that would have taken a long time to code in the past. And then I'll link you to the repository but that's not going to be as important as you'll see in this video. In the behind-the-scenes we're going to be using Cloud managed agents, Not because it's the only way to do it, but I just didn't want to build all the complex in between that you'll see as well. What's the in-between there? Well, let's talk about that for a moment. So when you have managed agents, they need to have shared memory so that maybe they can learn from each other with each run. Or they could have managed agents where one agent then spins up sub-agents. And again, that shared memory helps us know maybe what's that log about? How do we react to that log? Or what is the task we're on? Or as you'll see with this one, this is using AI to review some pickleball videos to see how I'm doing on a particular form or serving. And it could analyze that and with the memory, they could basically say, yeah, you're getting better, we hope. And then you have what we call sessions. So that particular session that it runs will have because of their dashboard. And there's so many options here. There's not just Anthropik, of course. That dashboard shows me what the agent's doing. What's the next step? What's the tool it's doing? Is it using or going a route that makes sense, which actually you don't really need to worry about so much anymore because they're getting so smart. What other agents is it calling and so forth? So you can kind of see a live running process of what's going on with the work it's doing. And then you have another important thing I've talked about in the Vibe Coding video article. you have it needing to get to environment secrets. So these are things that you want to give it, but you don't want to just hard code it into the request. So it goes and grabs those from the vault and uses them to get to an API that you told it could use. Now, did you have to write code around the API? No. Might it have a tool that it uses over and over again? Yeah, but it might not.  But you could connect tools to these agents. You could connect the official connectors like Google Drive or Gmail or HubSpot or whatever. And you could make your own MCPs and tools as well for it to use when it needs to, and that's great, you know? But we don't have to worry so much about them. For example, when we upload the video of me playing, I didn't have to make a tool to cut up the video or edit the video or get the transcript from the video. It just uses these well-known Linux tools to do the job. And from there, you know, the other parts of this framework that they give you, you know, you'll see as you go look. You can deploy the agents. But again, like agents are in this particular case just kind of waiting for their request. And so we just show how we upload the file and so the chat request. But it could be a chronological request. It could be an HTTP request from a chatbot, et cetera, that we have on our website. And then the second example will upload a zip file. and in doing so it knows how to unzip it. It knows that it's with the prompt what to do with that file. It knows how to chunk up that CSV file, rip through it, do anything we want with the math because it writes Python and we'll see that as well as I show you some screenshots of those sessions running. And then you're just going to see how even though it's a non-deterministic pathway that we can trust it. But we also have an article I wrote in Vowse, so you can kind of, not kind of, you can test this particular agent and see how consistently your prompt and its tools and its strategy will keep working. You can have a sense of consistency and a sense of cost because you can nail this down to the right model and the right prompt. All right, so below is the rundown of these examples, but hopefully you'll see that by doing this instead of maybe writing tools and writing things the old way, you can actually build some applications and do some long-running or short-running processes that used to be kind of hard to write on ourselves, even with vibe coding. And just to be clear there, there's an article in vibe coding, and you could vibe code a lot of this, but then you get into things like setting up events or timing and race conditions and waiting for one thing to be done before you can trigger the next thing. But otherwise, yeah, I hope you start to see how agents can be useful in how they work so you can remove some of the mystery but still enjoy some of the who cares? It just knows it just does it and I can just vibe code it. All right, enjoy.


TRANSCIPRT FROM THE VIDEO SHOOT I DID AND WILL REDO TO CLEAN IT UP A BIT

# Agents — Why, What, How · Transcript

_Source: agents-why-what-how.mp4 · 27:55 · sponsored by Miro · raw (unedited) timeline_

**[0:00]** All right, this is about agents, and we hear this word a lot, and I think last year people were predicting this is the year of agents, but what does that really mean?

**[0:10]** And I just want to show how much things have changed now that we can do stuff with agents, but really I want to show what that means.

**[0:19]** So I have a lot of experience with Linux, servers, ops, and all that stuff, so it's fun to see how this stuff comes around.

**[0:28]** So in this video, we'll just go over what are agents and how you can run your own agent.

**[0:35]** In this case, I'm going to use Claude to manage agents, but just like what does that mean?

**[0:40]** And we're going to take two particular tasks.

**[0:43]** We're going to take a video that I upload to the agent, and it processes it to figure out some things about my pickleball form, and then another agent that will do a bunch of files and let it do its thing.

**[1:00]** We're using Claude to manage agents, but it really doesn't matter.

**[1:04]** It's just there's a lot of wiring that they've done for us, and we'll look at what I mean by that in a moment.

**[1:10]** And now the big deal here is an agent is basically this kind of aha moment of where last year we would build a lot of tools.

**[1:18]** We would give an agent a request.

**[1:19]** It would use those tools, and a lot of that was like a node process or runtime, but now these agents can use a computer.

**[1:27]** And what's happening now, bizarrely enough, is they're using what we call Bash.

**[1:32]** And Bash is basically a command line type framework that then a lot of other little tools can run in there.

**[1:44]** Weird stuff like sed, awk, grep.

**[1:47]** And so it starts using those tools to then make its own collection of ways to do whatever you're asking it to do, which is pretty crazy.

**[1:56]** Of course, it's still can browse the web.

**[1:58]** It could even use the computer's browser to browse the web.

**[2:00]** So you can kind of see how we've gone from building tools that can use in what we call a runtime versus now just having a whole machine to itself.

**[2:10]** And that was a big deal.

**[2:12]** But there's a lot of details that I'm going to go over, but you're going to see it's not really going to be that hard.

**[2:16]** I just want you to understand how it works.

**[2:18]** So you can just use it without knowing all the how it works, but just enough to understand what's going on.

**[2:25]** And again, it removes us from having to write a bunch of stuff that you'll see like this file upload.

**[2:30]** This was a big file I would have had to put it to Supabase or something s3, trigger an event to make that event go break up the file to make the results of that event go take each file and in process it like that's a lot of work to put together to to to string it together.

**[2:49]** So one step doesn't happen before the other.

**[2:50]** So things don't time out.

**[2:52]** In this case, I just gave it to the agents to go do this.

**[2:55]** Now, this is a good example of a non deterministic, a non deterministic pathway.

**[3:05]** So maybe the next time or I run it 20 times and it doesn't always work, but you can use evaluations to prove that I've talked about that in different videos, I'll link to those that video after.

**[3:15]** So you can get to a place where you know your prompt and the agent has the particular prompt that needs the context and needs any extra tools it might need to get the job done.

**[3:25]** So for example, maybe it has to go to a particular service to get some information while it needs an API token while we're at API token right in the skill would tell it to do that or the prompt.

**[3:37]** And so let's now look now this video is not it's sponsored like Miro's paying to I'm going to show an ad from them in a moment or halfway through, but this is a pure training video.

**[3:49]** I really want to just train and help people understand how this stuff works because I really enjoy it.

**[3:55]** So now what we're going to do here in this first one is like I said, it was actually hard last year.

**[4:02]** You know, in many ways, I don't it, other than agents getting way better, but just like I would had to have maybe used an n8n or write some code or AI would have wrote the code and I would have had to figure out a way to deploy it or string it all together.

**[4:19]** But here I am, I'm just saying, hey, take this file, which is this file here, it actually, this is what blows my mind, like this file was too big.

**[4:28]** And it said, hey, I'm just going to do a 25 second version of that file.

**[4:31]** And I forget the exact reason why it chose that.

**[4:34]** But it was just so good that it was able to say, let's take it down a notch and lower the size of that file so we can get going on this now.

**[4:46]** What I'm using here is Claude extension in visual code.

**[4:52]** And I don't like recommend this.

**[4:55]** There's so many ways to do this stuff now.

**[4:58]** Many times find myself inside of just Claude working.

**[5:02]** So let me show that one moment.

**[5:05]** It's so hard to show this stuff.

**[5:07]** There's so much private or personal stuff in these things.

**[5:10]** Like usually I'll go to Claude code.

**[5:12]** This is just a screenshot or Claude desktop, sorry.

**[5:16]** And I'll go into the code tab here and just be in the code area, picking up sessions and working from there.

**[5:23]** So like it just depends on your preferences to get that stuff done.

**[5:29]** So now I'm in visual code and sometimes just because I like to have a folder manager here, but honestly, you don't need this much.

**[5:38]** You could even just be in Claude desktop in their co-work area.

**[5:43]** So anyways, okay, back to agents.

**[5:45]** So how did this work out?

**[5:48]** Well, obviously I can run it on my computer here, but I want to deploy this.

**[5:52]** I want it to run somewhere else.

**[5:55]** And this website is running on my computer, but I can easily put this to railway and I show that in another video I'll link to.

**[6:03]** But the ultimate goal is when I upload this file and this UI is completely basic, it was just to prove a point of it working.

**[6:12]** But when I upload that file, what it's going to do is send it over to Claude's managed agents.

**[6:19]** Now, remember, and hopefully I'll have a visual for this is like when you, you know, an agent is like a DoorDash person sitting there waiting for an order and, wait, would they be the restaurant or the DoorDash person?

**[6:36]** We'll call it the restaurant.

**[6:37]** So an agent's like a cook in a restaurant waiting for an order.

**[6:41]** And then you send it an order via the web or chat, which is the web or cron job, which is scheduled job, a chronological trigger.

**[6:53]** So we have these different ways to trigger the agent to start.

**[6:57]** In this case, I probably just uploaded the file and told, hey, here's the file, go do it your thing, which would be the system prompt.

**[7:04]** So somewhere in this code is a system prompt that says, hey, agent, when you, when you get going, you better not only process this file, but use my prompt to do it.

**[7:14]** And I'm not sure where it put the prompt.

**[7:16]** I'd have to look this over, but, you know, that is actually, I don't like to put the prompt in code because I want to update the prompt more easily.

**[7:22]** But the prompt in here says, hey, this is a pickleball file, analyze the person's do what the person's asking you to do with that file.

**[7:31]** So then I give it that and now it has the prompt, the context, the file and everything.

**[7:36]** And so what's really interesting here is it basically gets a computer.

**[7:40]** So if we look over here, we can start to see it.

**[7:44]** Now I'm going to upload a file while we wait.

**[7:46]** So one moment, let me just paste this in.

**[7:48]** It's going to be like, why is this guy keep asking me for the same thing over and over?

**[7:52]** But that's okay.

**[7:53]** And we're going to upload that file and send it.

**[7:57]** And we're going to go look at the other ones.

**[7:59]** So again, Claude Manage Agents, you can do this so many ways.

**[8:05]** So just Google it.

**[8:06]** OpenAI has it.

**[8:07]** Everybody has it.

**[8:08]** But the point is, I want to run something in the cloud or on a hosted server that can get the job done.

**[8:15]** Give AI the kind of computer, not kind of the computer it needs to get work done.

**[8:21]** But what's really the other pieces here are things that happen like you can have a files area, right?

**[8:28]** Just putting those files up there to process.

**[8:31]** You can have a skills area so you can actually have skills that you can share with these agents.

**[8:39]** You can have batches to do large processing.

**[8:45]** And then we can go down to environment credentials where you can start sharing API tokens that these agents might need.

**[8:55]** Memory store is important too.

**[8:56]** You could start building up a shared memory system so that when an agent wakes up, it knows what it did last time, it can share with other agents what it's been working on so that they can kind of fan out and get the same job done or learn over time from past memory.

**[9:14]** They even have something called dreaming, which comes in where it kind of optimizes the memory over time.

**[9:20]** So you can see there's a lot to this.

**[9:22]** But in the end, it's back in the day of like us setting up microservices.

**[9:28]** So it's that moment where a request comes in and this computer can run this little Linux box.

**[9:34]** So if we go back to the agent, we can see that we have this agent that was from a while ago.

**[9:41]** And if it doesn't run, I'm not going to worry about it, it's probably just processing or uploading the file.

**[9:48]** But we see that it ran a while ago, it has a prompt in the agent, so that's where that prompt is.

**[9:55]** And version is a prompt so we can maybe go back, we can choose different models.

**[10:02]** This is where you want to do evaluations.

**[10:05]** Maybe you upload the video with different models and using proper evaluation or built-in evaluation, you could say, hey, which were the best results?

**[10:14]** So the cheaper model gave the same great quality results as the expensive model.

**[10:21]** So oh, I wonder what raw is.

**[10:23]** Yeah, it's just that.

**[10:24]** So it's basically a YAML file.

**[10:26]** So YAML is just how they format it with the title and the text and the indentations.

**[10:33]** You have sessions where if it's not running, I think they'll be gone, created.

**[10:39]** Yeah, so this actually has history, so it doesn't have it there.

**[10:43]** So this is the agent 01, let's go look at something, 01, let's see, I want to grab this session, there we go.

**[10:58]** So we could deploy it and we can observe it and observing is kind of cool because this one I don't, this isn't the right dashboard, but this is kind of cool, but I want to see if I can find you a better observation, let's see something really quick.

**[11:14]** Okay, this is kind of cool because if there were more sub-agents being used in tools, it would kind of make a longer or more bars here of detail.

**[11:25]** So you can actually see what's going on, which is important.

**[11:29]** I mean, you know, it might not be using a tool you have, it might not be going the route you're hoping for.

**[11:35]** So you start making your prompt in your skills that's using better with better guidance.

**[11:40]** But this whole back end, I mean, trying to build this yourself would be a lot of work, not impossible, just a lot of little details, a lot of unknown unknowns.

**[11:52]** And this is a focus team and you can deploy this stuff to your own servers, so it's not all or nothing with them, and then you can get the benefits of their framework.

**[12:02]** But I'm not here to sell them at all.

**[12:06]** But I want to just show that what's there, right?

**[12:11]** So if we get this agent to actually run, thinking, thinking, thinking, let's see if it gave me an answer, which I shouldn't have, it might just be memory, let me recheck the uploaded file and maybe a new clip, same file, I'm going to grab a new file, one moment, I will start this one up again.

**[12:32]** That's just crazy how smart it was to just go do that and look for previous uploads that were the same video.

**[12:40]** It's just amazing.

**[12:41]** As someone who's built this stuff for eons, I just love how smart this stuff has gotten.

**[12:49]** So it says it's running, we'll let it go for a bit.

**[12:53]** So what I want to show though, and I don't know if I really, let's see if I can do this.

**[12:58]** Let's see.

**[13:00]** So this is the one, okay.

**[13:03]** So what I'm hoping to do is once that actually uploads and gets there, we'll start to see it running here.

**[13:07]** So I'm going to save this in a new, I'm going to save this, I'm going to open up a new tab.

**[13:12]** So if we open up this new tab, we can see it will hopefully upload that file in a moment and then we'll see a trigger there and we're not going to wait for this.

**[13:22]** But you know, we'll come back to it in a moment.

**[13:24]** So basically though, that is the overall concept I want to show is that it's booting up this particular server and it's able to do whatever it needs to do in this situation.

**[13:35]** I think when it's running, you can even do other stuff and see what it's doing, which is kind of interesting if it got stuck on a webpage or not.

**[13:44]** Look at these bash commands.

**[13:45]** So look what it's really doing is this is bash.

**[13:47]** So this is when you see that hacker showing the guys at a terminal or a person's at a terminal, they're just doing these things, right?

**[13:54]** But here it is using bash to going to directories, read files, break down files, whatever it's trying to do.

**[14:04]** There's so much you can do with bash.

**[14:06]** Now let's see what it did here.

**[14:10]** I mean, I don't do live demos.

**[14:27]** I just noticed this link here.

**[14:29]** So let's click on this and so this is the session.

**[14:32]** So the agent is the thing we're talking about who's got that computer ready to go.

**[14:36]** The session is the thing we started running in and we can watch the session and be in the session.

**[14:44]** Now you can even chat with the session maybe because this one's over so you can come here and chat with it for a while.

**[14:58]** That is funny.

**[14:59]** So I have to go fix that.

**[15:00]** I want to do that right now.

**[15:02]** One moment.

**[15:03]** Okay, so I just did a quick prompt to hopefully fix it, but you can see the session's live.

**[15:09]** And so, you know, it's just on the computer.

**[15:11]** It's computer, not my computer, running all of these commands, reading and running bash, make a directory, ffprobe.

**[15:21]** So again, these older commands are now being used to do some crazy stuff with video and files.

**[15:29]** I'll do one in a moment, which is files.

**[15:30]** We'll look at that in a moment.

**[15:32]** So I mean, that is basically the gist of how these agents can be used, running long processes, figuring out what it needs to do on its own with its own files, and then just getting the job done.

**[15:48]** This is happening in the cloud, not on my computer, not on the computer I might be hosting the website on.

**[15:54]** So maybe I host the website on railway, but then when it calls out to the agent, it's all happening on this.

**[16:00]** And it can be, it can be, you know, again, it's not about cloud managed agents.

**[16:05]** It's just showing you the complexity that's being dealt with here for session management stuff, environment variables, all those things.

**[16:14]** These are really hard.

**[16:15]** Not hard.

**[16:16]** I have a video on Supabase and using its vault, so it's not that it's hard.

**[16:19]** It's just all these details, honestly.

**[16:22]** And let's see, we do have a memory state here too.

**[16:25]** So we're starting to save memory about my conversation so we might know who I am as a player.

**[16:30]** Of course, this if you, if this was a multi-user project, you'd have to figure out how to parse this out per user.

**[16:36]** All right, so we're going to just give an ad for Miro just to show that cool product who's sponsoring this, and then we'll come back and we're going to look at how it can be used to deal with lots of files and file processing without doing the whole RAG pipeline.

**[16:53]** All right, so now for the next demo, I'm going to upload a zip file.

**[16:59]** Not even uncompressed CSV.

**[17:01]** And again, thanks Miro for supporting this.

**[17:05]** So now, if we look for a moment, one thing I was showing during the, before the break was I have different areas here, workspaces, and if we go to the correct workspace, we'll get a little bit more information.

**[17:18]** And if you look, we can start to see that it uploaded the files.

**[17:23]** It uploaded a sample while I was building, but it uploaded that file earlier, and then of course we had our agents doing the work five minutes ago, and then that agent has sessions and that particular session, which is over now, was doing some work there.

**[17:40]** That might be the session to get that, that's just crazy, the UI.

**[17:45]** But you can start to see like these different areas in here that are doing the work and the different agents that are doing the work.

**[17:53]** So now let's do the, the file, so I'm just going to go grab that file I now have, let's go grab that, I think, and like I said, I'm just going to keep it as a zip, but you can kind of see it just doesn't matter because if you give AI a zip file, it's just going to use bash to open that, or a tool inside of bash.

**[18:18]** So now if we send that off to, to it, it will upload that file to a place that the system or the session will have access to it, so platform cloud, that's the session, and it will start doing some of the work to then upload the file and do stuff.

**[18:40]** Now, you know, it took a moment to say, hey, listen, wait, you know, make sure it waits for the file because my little chat system was a little bit off, right?

**[18:47]** But that was just one prompt and then the AI had the file and access to the file, so they can do stuff with it on the, on the computer.

**[18:58]** Again, look at it says tool, the tool is using bash and it's using find, which is a command inside of bash.

**[19:06]** So if you like think about that for a moment, it's so crazy, it's using find, and then it echoes and then it lists all the results and then it shoots those results in a dev null, so it's not a bunch of data here.

**[19:21]** But that's just how that stuff works at the bash command where it can do all these different things and connect them together.

**[19:28]** So that might be it just waiting.

**[19:30]** Let's find out and I'll pause it again if it gets stuck.

**[19:33]** So it might just still be uploading or waiting.

**[19:35]** I didn't test any of this before I did it because I don't really want to focus on the actual code, but if we look at the files, we would hope to see that gz file.

**[19:46]** So it's, it's probably this guy and it's still uploading is what I'm guessing.

**[19:53]** And it will take a moment.

**[19:56]** I don't think it's that big of a file, I should have checked, let's go look.

**[20:05]** 21 megs is kind of big.

**[20:07]** But that's the cool part is we can just do this stuff and let the agent work on it.

**[20:12]** Now, of course, you want to think about scale and stuff, sometimes you're just building something for you or the office, and you're not trying to sell it to a bunch of people so you can scale more easily.

**[20:25]** And it's not, again, the big challenge it was before.

**[20:32]** So let's see here, is it getting anywhere?

**[20:35]** Let's see.

**[20:38]** All right, just to look here for a moment, like you can see like the user me ask a question.

**[20:48]** The agent said, I'll start locating inspecting the file for you.

**[20:52]** So the file has been uploaded.

**[20:54]** And then the tool it uses the bash tool, which again, it can then make its own sub tools or string together tools like LS, find, echo.

**[21:06]** Those are just tools at the command line.

**[21:11]** Then the agents like found it, right, and then it says, okay, bash, I'm going to use you again.

**[21:15]** I'm going to mount the session that has the file.

**[21:21]** It's going to then list the file, it's going to figure out how many lines of code, sorry, how many lines in that file, figure out the header, like I used to have to code all that.

**[21:34]** Then the agents like a clean well formed 5000 data rows file six, I mean, that's amazing.

**[21:40]** So you could have a system that can take any file type and process it.

**[21:46]** The tool, again, bash, it's mounting the file.

**[21:52]** So that's just a way of saying, hey, I don't know what the F means.

**[21:55]** So F might be the, what's the word for it?

**[21:59]** When you have bash, you have a variable that it's setting.

**[22:02]** So F equals that.

**[22:03]** So echo first rows head of F.

**[22:06]** So F is saying of that particular row, sorry, of that particular variable, which is that particular path you see there.

**[22:13]** That's a path in the file system.

**[22:15]** awk, it's another tool to do something.

**[22:19]** awk is such an awesome name.

**[22:21]** And it's getting data from that file.

**[22:24]** Clean data, right?

**[22:25]** So it's evaluating the data.

**[22:27]** Then it wrote a bash command, no, wrote a Python command.

**[22:31]** So it says, okay, I'm going to again, set a variable for that file.

**[22:36]** Then I'm going to take Python and I'm going to do that path and I'm going to do this particular Python commands.

**[22:43]** And now you have a computer that has Python, which is just the thing for this, and it's going to use that to parse that data.

**[22:53]** Interesting, there are only nine unique recipients.

**[22:56]** So again, this was a small data set.

**[23:00]** And then we have it doing the file thing again, Python again, like it's building these tools on the fly.

**[23:06]** That is just so cool.

**[23:08]** We come back to the agent saying, interesting, there are only nine unique tools confirmed exactly nine.

**[23:14]** So it's confirming itself.

**[23:16]** Just amazing.

**[23:17]** And then it goes back to bash and it's like, let me do Python against it.

**[23:21]** Let me do more Python against it.

**[23:23]** Let me read that and then generate.

**[23:27]** So good.

**[23:28]** Like, that's just cool that it was able to do that.

**[23:30]** Now imagine pulling that into your graphics, into your chat and the user can have a good experience or you generate and post it somewhere else.

**[23:38]** Here's another message it makes.

**[23:40]** It shows this particular data in a way that maybe it can shoot back out to your chat system to have a response.

**[23:46]** Now that was the AI doing it on its own earlier.

**[23:51]** Here's the results from the file I uploaded a moment ago, which was way bigger.

**[23:55]** And let me check something because I'm really wanting to double check, even though I don't want to get distracted.

**[24:00]** So there's the 21 megabyte file and the agent had to kick in and read that.

**[24:08]** So let me make sure I'm in the right area and then the agent's like, yeah, 13 minutes ago and it has a session.

**[24:15]** And here's where I might not be seeing the right session one moment.

**[24:18]** I'll make sure we get the right one.

**[24:22]** So this one, I'm not sure if it's the right one.

**[24:24]** That might just be me misreading something.

**[24:27]** But if we go back to this, let me locate the file, found it 21 megabytes zipped and then it opens it up.

**[24:35]** It talks about what it is.

**[24:39]** It feels they're present and its picture is clear.

**[24:46]** I could ask more questions about it.

**[24:49]** Wow, that's a lot of money.

**[24:54]** Let me see if I can do this one while we wait and then we'll just keep looking at it one moment.

**[25:01]** OK, so then it goes down the list of, wow, top contributors to let's see, this is depressing.

**[25:20]** So top financial contributors to the, it just blows my mind this stuff.

**[25:35]** So look, this is like data from the Federal Elections Commission and these are some of the top contributors, right?

**[25:43]** And I don't want to get distracted by this, but you get the point.

**[25:45]** It was able to pull all that data from that file, from that website.

**[25:49]** It could have done the whole thing itself and it could go down the row and see who are the top contributors.

**[25:56]** American Express, I would not have thought that.

**[25:59]** Wow, that's a wonderful name for a company.

**[26:04]** All right, so we can see though, it was able to do all that work with that file without me doing much.

**[26:10]** And then it made that, again, this isn't on my computer, this is on those servers.

**[26:17]** And if it's on my computer, mistake, but you get the point.

**[26:20]** It happens on these computers here.

**[26:23]** So that is the power of agents.

**[26:27]** You hopefully can see now, you're basically running a computer with AI controlling it.

**[26:33]** So it can do all that bash stuff.

**[26:34]** So it can just use the tools it has natively in Linux that can build quickly with Python and that it can just do on the fly and research the web with some other tools.

**[26:45]** It's just endless what you can do with the command line.

**[26:48]** Now in 2025, we built those tools, searched the web, grabbed this file, chunked this data.

**[26:55]** Now it just does it and that is a big deal.

**[26:59]** And you can make it pretty deterministic too with the right prompts and the right structures and the right sub-agents and whatnot, which are well-tested and hyper-focused at this effort.

**[27:09]** I hope that helps you to see how you can use agents, how it's a different game, how you can get away from building complex node or runtimes that you're hosting and just give the AI the task to do in the computer to do it on and let it do its thing.

**[27:26]** Again thanks to Miro for supporting this video.

**[27:30]** I'm just glad to train and teach and share and without having to really focus on one particular product, but I'm glad that advertisers like them help.

**[27:41]** So click the link below and help support the channel.

**[27:46]** And then if you have any ideas, comment below on what else you want to learn about and I'll just keep sharing what I'm learning as I go.

**[27:53]** All right.

**[27:54]** Thank you.