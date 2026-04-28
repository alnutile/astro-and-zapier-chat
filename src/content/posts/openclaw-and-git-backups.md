---
title: "OpenClaw and Git Backups"
date: 2026-02-02
excerpt: "Just a quick tip on using Git to backup the folder"
image: "https://substackcdn.com/image/fetch/$s_!HuEA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27283415-e4dd-4990-bbff-78c740fd9506_2004x1206.png"
tags: []
# original_url: https://substack.com/home/post/p-186562966
---

If you’re running OpenClaw (or Molt Bot) on your Mac, Linux, or Windows machine, here’s a quick tip that could save you a headache down the road.

When you install OpenClaw, it creates a hidden dot folder (`.openclaw`) on your system. This is where the agent stores its configuration, credentials, memory, workspace files, and more. The thing is — the agent is actively reading and writing to these files as it runs. Things change. And sometimes things break.
## Put Git in the Folder

You don’t need to push anything to GitHub. Just initialize a local git repo inside the `.openclaw` folder:

bash
```
cd ~/.openclaw
git init
git add .
git commit -m "initial snapshot"
```

That’s it. Now you have a baseline.

As the agent makes changes over time, you can run `git diff` to see exactly what files were modified and what changed inside them. If something goes wrong, you can roll back. It’s a simple safety net that costs you nothing.

A few commands that come in handy:

- 
`git diff` — see what changed since your last commit

- 
`git add -A && git commit -m "snapshot"` — save the current state

- 
`git log` — see your timeline of snapshots

- 
`git stash` — quick undo if something just went sideways

[

![](https://substackcdn.com/image/fetch/$s_!HuEA!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27283415-e4dd-4990-bbff-78c740fd9506_2004x1206.png)

](https://substackcdn.com/image/fetch/$s_!HuEA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F27283415-e4dd-4990-bbff-78c740fd9506_2004x1206.png)

## Finding the Hidden Folder on Mac

Since `.openclaw` is a dot folder, it won’t show up in Finder by default. Hit **⌘ Shift .** (Command + Shift + Period) to toggle hidden files. From there, I like to drag the folder into my Finder sidebar so I can get to it quickly — I’ve found myself needing to poke around in there more than once.

[

![](https://substackcdn.com/image/fetch/$s_!KmE5!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffbeedfe0-6962-47db-aeae-95e4a8273cd4_1126x988.png)

](https://substackcdn.com/image/fetch/$s_!KmE5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffbeedfe0-6962-47db-aeae-95e4a8273cd4_1126x988.png)

## Why Bother?

OpenClaw is doing a lot behind the scenes — updating configs, writing to its workspace, managing credentials. Having git in place means you can:

- 
**See what changed** after an update or agent run

- 
**Roll back** if a config gets corrupted or overwritten

- 
**Track the agent’s behavior** over time by reviewing diffs

It’s not a replacement for proper backups, but it’s a lightweight layer of protection that takes 30 seconds to set up.

Have any questions? Share below!

---POSTBREAK---

