# Why Learn to Build Your Own Stack — working outline

> Status: **working draft / outline** (not for publish yet). Lives in `drafts/` so the
> Astro content collection does not pick it up. Preview draft lives at
> `src/content/posts/why-learn-to-build-your-own-stack.md` with `draft: true`.
> Stack Builder class repo still coming from Alfred.

## Decisions locked
- **Series:** how to self-host your own stack (post 1 = classic stack).
- **Title job:** help say *why* learning to build your own stack matters — especially as we try to integrate all these other systems together. Not a clever “one command” hook.
- **Voice:** keep spoken phrasing; organize + titles; do not rewrite into polished AI language.
- **Structure:** why / what / why-it-matters **before** the Terraform/AWS how.
- **Scope of post 1:** one classic stack on a Linux box (DigitalOcean + AWS focus). Not Stripe. More office / intranet apps. K8s later. Multi-app on one box = next article.

## Working title
**Why You Should Learn to Build Your Own Stack**
Alts: "Learning to Build Your Own Stack Matters More Than Ever" · "Self-Host Your Own Stack (Series Start)"

**Series line:** This is the first post in a series on how to self-host your own stack.

**Excerpt:** Managed services are great until the bill and the environments pile up. I'm starting a series on building your own stack — Terraform, Docker, CI, deploy — so you can stand up predictable, secure places to run the apps you're wiring together.

**Tags:** `[devops, terraform, docker, laravel, aws, digitalocean, infrastructure-as-code, self-hosting]`

---

## TLDR (top of post)
- Starting a series: how to self-host your own stack.
- “Stack” = the combo of resources that host your app (compute, DB, queue, storage, DNS, later load balancer).
- Railway / Supabase / Cloudflare etc. are amazing — and they add up once you have many stacks or environments.
- Goal of lesson 1: one command stands up a classic stack you can deploy to — IaC, CI, zero-downtime deploy, no clickOps.
- Classic stack here: Laravel + Redis/Horizon + Postgres + storage on the box, Docker everywhere, Terraform on DO/AWS.

---

## Part 1 — Why this series (hook people here)
- What I mean by stack / why you’d want this.
- What I use today: Railway, Supabase, queue, Cloudflare DNS; storage/auth/websockets often via Supabase; later load balancer.
- Cost + many ideas + multiple environments (dev/stage/prod, “building an internet”).
- Terraform (and later Kubernetes) to quickly stand up different types of stacks = combinations of resources with **predictable pricing**.
- Especially important as we integrate other systems (cloud-managed agents talking securely into AWS, good networking, containers you can keep updated).

## Part 2 — What this is / isn’t
- Not Stripe and every SaaS bolt-on.
- Focus: internal / office / intranet-style apps; security so only certain users get in (later in series).
- End of lesson 1: one command → deployable system.
- Path: build stack → CI into trunk after tests → auto deploy. Zero downtime. Migrations. No clickOps.
- Docker: run locally; Linux box can go out of date without you fearing the app/queue broke.
- Rich example on purpose: Laravel, Redis + Horizon, automated QA, Postgres migrations, storage preserved across deploys via volumes / attached storage.
- K8s later. Grow through this together. AI ops is fun again. Basic Linux helps; AI can help when you’re stuck on SSH (can be wrong; still useful). Ask below too.

## Part 3 — Where the code lives
- All on GitHub. Pull down, run Terraform like `npm init` for infra requirements.
- Focus DigitalOcean + AWS (AWS not favorite; works fine).
- AI notes to resolve in writing: local `terraform apply` on Mac; keep app + Terraform together; does CI sync Terraform state before deploy?; domain early for CORS on uploads?

## Part 4 — Build the stack (how, after why)
- AWS CLI + Terraform ready; plan → apply.
- Diagram beat: EC2 + Docker → containers → Laravel; internal Docker net to queue; elastic/attached storage.
- Deploy via GitHub Actions (not CodePipeline — limiting; could integrate later).
- App repo: Laravel auth/login; prove queue, uploads, migrations. Push → tests → deploy if green.
- Prefer code with the classic/build folder so Terraform + staging live together.
- Deploy to existing system: container up, migrations, take traffic, no downtime.

## Part 5 — Prove it
- Login (boring on purpose).
- Upload file → Docker → volume on server → survives next deploy → attached storage / backup options.
- Redis + Horizon watching jobs.
- Websockets another time.
- Billing = these resources; not auto-scaling yet.
- Point: not RDS/SQS/S3 in this lesson — a Linux box (which is what a lot of managed stuff is under the hood). One box can host many apps later.

## Part 6 — Next in the series
- Multiple apps on one box: ports, incoming traffic, routing.
- Domain names (this demo used IP).
- Maybe domain sooner for CORS on file upload.
- Video shortly.

## Cover image prompt (when ready to publish)
Handwritten notebook page photographed from above on a wooden desk, cream/off-white. Hand-lettered title “Build Your Own Stack” with **Stack** in blue. Left-to-right flow of 3 boxes — blue “Why / cost & control”, red “Terraform + Docker”, green “CI → deploy” — yellow arrows between them. Bottom yellow callout: “Predictable pricing. No clickOps.” Casual sketchnote feel.
