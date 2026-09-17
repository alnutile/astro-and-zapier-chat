---
title: "Why You Should Learn to Build Your Own Stack"
date: 2026-09-16
excerpt: "Managed services are great until the bill and the environments pile up. I'm starting a series on building your own stack — Terraform, Docker, CI, deploy — so you can stand up predictable, secure places to run the apps you're wiring together."
tags: [devops, terraform, docker, laravel, aws, digitalocean, infrastructure-as-code, self-hosting]
draft: true
faq:
  - question: "What do you mean by a stack in this series?"
    answer: "The combination of resources that host your application — compute, database, queue, storage, DNS, and maybe a load balancer later. Not every SaaS bolt-on like Stripe. More the place your internal or office apps actually run."
  - question: "Why build your own stack instead of using Railway or Supabase?"
    answer: "Those services are amazing. They also add up once you have a lot of ideas, multiple environments, or you are building something like an internet of apps. Building your own stack with tools like Terraform gives you predictable pricing and a place you control when you start wiring other systems in."
  - question: "Why does this matter for integrating other systems and AI agents?"
    answer: "When cloud-managed agents or third-party services need to talk into your AWS or other cloud setup, you need secure networking and a clear target. Containers help you keep things updated and scale. That pays off when you understand the stack underneath instead of only clicking through managed dashboards."
  - question: "What is the classic stack in this first lesson?"
    answer: "A Linux box with Docker: Laravel for the app, Redis and Horizon for queues, Postgres with migrations, and storage on volumes so uploads survive deploys. Terraform stands it up. GitHub runs tests and deploys with zero downtime and no clickOps."
  - question: "Are you using RDS, SQS, and S3 in this first lesson?"
    answer: "No. This first lesson is just a Linux box — which is what a lot of managed services are underneath anyway. Dedicated cloud databases, queues, and object storage are options later. The next article covers hosting multiple apps on one box."
  - question: "Do I need to be a Linux expert to follow along?"
    answer: "You need some basic Linux, including things like SSH. Do not panic about it. AI can help, even when it is wrong, and you can ask questions on the post. The goal is to grow through this together, not to assume you already know every command."
---

> **TLDR:** I'm starting a series on how to self-host your own stack. By "stack" I mean the combination of resources that host your application — linux box, database, queue, storage, DNS, maybe a load balancer later. Services like Railway and Supabase are amazing. They also add up money wise and more importanlty knowing how to connect your intranet into managed agents and other systems is key. By the end of this first lesson we'll have one command that builds a classic stack you can deploy to: infrastructure as code, CI after tests, automatic deploy, zero downtime, no clickOps.

This is post one in a series: how to self-host your own stack.

## Why learning to build your own stack matters

![Stack One](/images/why-learn-to-build-your-own-stack/stack-1.png)

I use services like Railway and Supabase and I might use a queue system like Redis etc. Later on maybe a load balancer. Storage, authentication, websockets — a lot of that I get out of Supabase but running your own Supabase can be a lot.

These are amazing services. They can also add up. Supabase isn't free after your first few stacks. And when building the company intranet with multiple environments it will add up.

So how do we use tools like Terraform (and later Kubernetes) to quickly stand up what I call different types of stacks — that combination of resources — with predictable pricing? And then how do we get our code there easily.

This matters even more as we try to integrate all these other systems together. For example Claude Managed Agents might need to access a file on your storage area, or a service. Containers are key too so you can keep them more up to date and scale. Even if you go back to Vercel + Supabase + GitHub Actions etc it is still great to know these things.

## What I mean by stack (and what this series is not)

This isn't going to be about Stripe integration and things like that. This is more for intranet applications that you're building for internal business use.

When we deploy these stacks, we start simple.

The first one is a simple Terraform command that builds up our stack on AWS (later Azure and Google Cloud). What we end up with is a very predictable pricing stack.

You could go a couple of ways: dedicated databases, dedicated queue systems from the cloud. Or we can just use something like an EC2 — a Linux box basically. We'll try a whole bunch of them. Every cloud provider. Later I will start to use Kubernetes to more easily manage the running services and scale as needed.

By the time we're done with this first lesson, we're going to have one command, and we're going to build a system we can deploy to.

Classic path:

- Infrastructure as code
- CI — continuously pushing code and integrating it after tests into our trunk
- Automatically deploy to that system

I will have trainings videos on all of this. First we build the stack. Then we enjoy deploying to the stack by pushing the code there.

We'll have zero downtime during the deployments. Migrations with basically no touch. No need to click. No clickOps. All infrastructure as code.

## Why Docker

We're going to use Docker. It's just amazing because we can run these locally, mess around locally, see our stuff working, and then deploy it. Even more importantly: we just won't care as much when our Linux box is out of date. We can update it without worrying about breaking our application or the queue system or whatever.

This is going to be a stack based on Laravel to start, Postres as the database, Redis for queueing, and storage will be a "volume" we can backup and share as needed. Horizon so we can do queue jobs for us. GitHub actions will do all the Continuas Integration and Deployment, migrations will be in code.

Later on we'll get into Kubernetes. Right now I'm just trying to keep it simple. I want to grow through this together — and I mean grow, because we're going to be learning and changing and doing. AI ops is fun again, in my opinion.

Yes, you'll need to know some basic Linux stuff. Don't worry about it. You always have AI to help out. It can be wrong. It's still amazing. You might get stuck on SSH. Ask AI. Or ask below - I'll try to help you.

## Where the code is

The code's all on GitHub. When you pull it down you can run your Terraform in it to get going and set up the infrastructure requirements. Kind of like `npm init` — hey, give me what I need to run this.

We'll focus first on an AWS system but again we will do Azure, GCP and maybe some others

## Build it (the short version for this draft)

This repo will have the code. [https://github.com/alnutile/labs](https://github.com/alnutile/labs) you can:

``
git clone git@github.com:alnutile/labs.git 
cd labs
``

To get going.

You will need to install aws cli, terraform cli as well and set those up.

This is so well known that you can use the terminal (yes use the terminal this will be good to get comfortable with) and start **codex** or **claude** and ask it to get these setup for you.

Once you setup an AWS user you can use and configure aws cli to have the permissions needed **AdministratorAccess** to get that to have the rights we need to kick this off.


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
