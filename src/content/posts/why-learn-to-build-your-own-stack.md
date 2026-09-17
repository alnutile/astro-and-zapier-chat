---
title: "Why You Should Learn to Build Your Own Stack"
date: 2026-09-16
excerpt: "Managed services are great until the bill and the environments pile up. I'm starting a series on building your own stack — Terraform, Docker, CI, deploy — so you can stand up predictable, secure places to run the apps you're wiring together."
tags: [devops, terraform, docker, laravel, aws, digitalocean, infrastructure-as-code, self-hosting]
draft: true
---

> **TLDR:** I'm starting a series on how to self-host your own stack. By "stack" I mean the combination of resources that host your application — compute, database, queue, storage, DNS, maybe a load balancer later. Services like Railway and Supabase are amazing. They also add up. By the end of this first lesson we'll have one command that builds a classic stack you can deploy to: infrastructure as code, CI after tests, automatic deploy, zero downtime, no clickOps.

This is post one in a series: how to self-host your own stack.

And before I jump into Terraform and AWS — which I always want to do too fast — here's the why.

## Why learning to build your own stack matters

I use services like Railway and Supabase. I might use a queue system. Cloudflare or something for DNS. Later on maybe a load balancer. Storage, authentication, websockets — a lot of that I put on Supabase.

These are amazing services. They can also add up. Supabase isn't free after your first few stacks. We have tons of ideas. Or you're building an "internet" and you want multiple environments.

So how do we use tools like Terraform (and later Kubernetes) to quickly stand up what I call different types of stacks — that combination of resources — with predictable pricing?

This matters even more as we try to integrate all these other systems together. Good networking so things stay secure. Containers so you can keep them more up to date and scale. Cloud-managed agents that need to talk into your AWS system securely, and really target the right level. That stuff pays off when you actually understand the stack underneath.

## What I mean by stack (and what this series is not)

This isn't going to be about Stripe integration and things like that. I'd say these are more your internal / intranet applications that you're building for the office. We'll even cover things like security so only certain users can access the app.

When we deploy these stacks, we start simple.

The first one is a simple Terraform command that builds up our stack on DigitalOcean, on AWS, on Azure, on Google Cloud. What we end up with is a very predictable pricing stack.

You could go a couple of ways: dedicated databases, dedicated queue systems from the cloud. Or we can just use something like an EC2 — a Linux box basically. We'll try a whole bunch of them. Every cloud provider. Keep it simple, or complicate things in a good way.

By the time we're done with this first lesson, we're going to have one command, and we're going to build a system we can deploy to.

Classic path:

- Infrastructure as code
- CI — continuously pushing code and integrating it after tests into our trunk
- Automatically deploy to that system

I have trainings on all of this. First we build the stack. Then we enjoy deploying to the stack by pushing the code there.

We'll have zero downtime during the deployments. Migrations with basically no touch. No need to click. No clickOps. All infrastructure as code.

## Why Docker (and why a rich example)

We're going to use Docker. It's just amazing because we can run these locally, mess around locally, see our stuff working, and then deploy it. Even more importantly: we just won't care as much when our Linux box is out of date. We can update it without worrying about breaking our application or the queue system or whatever.

This is going to be a rich stack with a rich example. Laravel, just because it has some of the aspects built into it. Redis for queueing. Horizon so we can do queue jobs, with examples. Automate the QA in testing. Postgres, of course, and migrations. Storage on the box — but preserved every time we deploy (volumes pointed at storage that stays on the server / attached disk).

Later on we'll get into Kubernetes. Right now I'm just trying to keep it simple. I want to grow through this together — and I mean grow, because we're going to be learning and changing and doing. AI ops is fun again, in my opinion.

Yes, you'll need to know some basic Linux stuff. Don't worry about it. You always have AI to help out. It can be wrong. It's still amazing. You might get stuck on SSH. Ask AI. Or ask below — I'll try to help you.

## Where the code is

The code's all on GitHub. When you pull it down you can run your Terraform in it to get going and set up the infrastructure requirements. Kind of like `npm init` — hey, give me what I need to run this.

We'll focus a DigitalOcean system and an AWS system. AWS isn't my favorite, but it does really fine.

Now that we've gone through the cloud movement and we're at the AI movement, it's really important to understand how to integrate these services, how to do good networking so it's secure, how to deal with containers.

## Build it (the short version for this draft)

AWS CLI connected. Terraform ready. `terraform plan`, then `terraform apply`.

What we're building (I'll show the image in the video / next pass): an EC2 that has Docker installed, containers running, traffic redirected to the Laravel application. That app uses Docker's internal networking to talk to the queue and other things. For storage we'd probably use elastic / attached storage.

I'm not using AWS CodePipeline. I found it very limiting. We could integrate with it. For now: GitHub runs the tests, and if they pass, it deploys.

There's a separate Laravel app with authentication and login and basic stuff — or we move it into the folder with the classic stack so the code lives with the build. If I want to change the Terraform or add a service, I can do it there. Staging build too.

**AI notes I still need to settle while writing / filming:**

- How clean is local `terraform apply` on the Mac?
- During the GitHub build, are we synchronizing Terraform state so we know we have the resources needed to deploy?
- I might need the domain early so I don't get CORS issues on file uploading.

When this pushes, it deploys to that existing system. No downtime. Docker container up, migrations, take the traffic.

## Prove it after deploy

I've already made a username and password — that's not really that exciting. Log in. Upload a file. Where did that file go? Docker command line. It's part of a volume on the server so the next deploy won't wipe it. In this case that volume sits on attached storage the cloud gives you, so you can back it up that way (or other ways — it's not that hard).

Queue: Redis running. Horizon is okay. There's better queue UIs, but it's good enough. Watching jobs pop.

Typically you need websockets with advanced applications — talk about that another time.

Now you have a complete classic stack. The billing is whatever these resources cost, because we're not auto-scaling yet.

Important: this isn't using AWS RDS, or SQS, or S3. It's just using a Linux box — which in the end is what a lot of this stuff really is underneath. Or FreeBSD if they're crazy. We set up a simple box to do this. That box could host 10, 20, 30 applications. That's the next step. This one is just the one.

## Next article

How to do multiple applications on one box — port overlapping, incoming traffic, directing it. In this case I got to the system via IP address. We'll talk about domain names too, so you can have a better user experience.

Video shortly. Stack Builder class repo is the companion for this series — I'll link it when that handoff lands.

---

*Draft / outline mode. Structure and titles helped; wording kept close to the spoken transcript. Cover image and final polish still TBD.*
