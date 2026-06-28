---
title: "Vibe Coding With Confidence"
date: 2026-06-28
excerpt: "It still amazes me that we can vibe code our own apps. Here's how to do it with confidence — keeping it secure, getting it hosted, and not getting scared off by GitHub — all built around the humble to-do list."
image: "/images/vibe-coding-with-confidence/cover.png"
tags: [ai, vibe-coding, security, no-code, zapier]
faq:
  - question: "Is a vibe coded site safe to put online?"
    answer: "It depends on what it does. A static HTML file you host on a service like Railway and put Cloudflare in front of is pretty safe. The more your app does — logins, a database, saving people's data — the bigger the surface to think about. Nothing is unhackable, but you can be sensible about it."
  - question: "How do I host something I vibe coded without a lot of setup?"
    answer: "Push your code to a GitHub repo, point a host like Railway at that repo, and it deploys on every push. You get HTTPS for free. You can add your own domain through something like Cloudflare after that."
  - question: "Do I have to learn GitHub to vibe code?"
    answer: "Not deeply. Conceptually it's just where your code lives so a host can pick it up and deploy it. The AI can handle most of the GitHub steps for you — it helps to understand what it's doing, but you don't need to be an expert."
  - question: "How do I keep a user's data private in a vibe coded app?"
    answer: "Use a real auth system (never roll your own) and turn on row level security in your database so people can only see their own rows. Supabase makes this approachable. Also be careful what you expose to the public-facing front end — anything prefixed for the browser is visible to users."
  - question: "Can my vibe coded app talk to other services without me wiring up all the credentials?"
    answer: "Yes — this is where an SDK like Zapier's helps. It handles the integration and credential side so your app (or an agent you host) can sync with things like Google Tasks without you managing all the auth plumbing yourself."
---

> **TLDR:** It still kind of amazes me that we can vibe code our own apps now. This is me sharing how to do it *with confidence* — three things that trip people up (security, hosting, and GitHub), none of them as scary as they sound. We'll build the whole thing around the most boring, most perfect example there is: a to-do list. By the end you'll go from a static "hello world" all the way to your own little agent that has access to one of your own systems.

---

I want to write about vibe coding because, honestly, it's still amazing to me that we can build and ship our own applications this way. Something shifted at the start of the year — Claude Code, Codex from OpenAI, Cursor — these tools got genuinely good at vibe coding a real application *and* at hosting a simple static file you just want to share with someone.

So I want to cover the little nuances of vibe coding so you can feel more comfortable doing it, and not get caught up in the negative vibes floating around about it right now.

Quick disclaimer before we go: I'm just sharing what's worked for me. The audience I have in mind is pretty wide — maybe you're a junior dev, maybe you're someone who just wants to get an idea out of your head and onto the internet. Either way, this is for you.

> 📸 **SCREENSHOT:** the finished to-do app we're building toward — the board view with Backlog / Next / In Progress / Done lanes. (Set the destination up front so people know where we're headed.)

## The three things people get stuck on

Here's the whole article in three words: **security, hosting, GitHub.**

Those are the three things that can make people nervous about putting their vibe coded work into the world. I'm going to walk through each one, and then we'll do it for real with the to-do list.

A note on order: I actually built the demo starting with the exciting stuff and worked my way back to GitHub — but that gets confusing. So in this write-up I'm going to introduce GitHub naturally, right where it shows up (the first time we host), and build up from "boring and safe" to "fancy" from there.


> I share prompts and skills but there are no "magic" prompts. So just use what makes sense and work with AI to continue building the way that works for you.

## Why a to-do list?

Because everyone understands it. A to-do list is the perfect foundation. We can literally start with a static "hello world" page — *technically* even that could be a kind of to-do list — and grow it step by step until it's a real, secure, multi-user app that syncs with your phone.

Watch how far this one humble example can take us.

## 1. Security — it won't be scary

Let's get the scary one out of the way, because it isn't.

There's no single magic answer to security, and here's the honest truth: **no matter how hard you work, your site is hackable.** It's very rare for a site to be completely un-attackable. But — and this is the key idea — **the scope of hackability grows with the complexity of your site.**

So if I'm just sharing a static artifact — some HTML with CSS and JavaScript baked in — and I put it on a web host so people can visit it in their browser, that thing is *pretty darn safe.* All that's happening is: a browser downloads an HTML file and renders it. There's not much there to attack.

> Remember obscurity is NEVER security. You can not depend on funky URLs etc to equate to a secure page.

(Side note on why hosting beats emailing a file: if you just email someone an HTML file, it might not open, their machine might block it, Windows vs. Mac weirdness, or your interactive bits silently don't work. Hosting it means everyone gets the same experience, the way you intended.)

![Our First Deployment](/images/vibe-coding-with-confidence/static-todo-area.png)

We'll talk about putting **Cloudflare** in front of things in a moment, which adds another layer. But the headline for this section is simple: **the more your app does, the more you have to think about. Start simple and you start safe.**

## 2. Hosting — also not scary

Ok, so I've vibe coded a static artifact and I want to share it. I'm not using Lovable or Replit here — for whatever reason (pricing, preference) I'm doing it on my own. So I tell the AI:

> "Deploy this to a known service."

I'm going to choose **[Railway](https://railway.app/)**. (Not a paid plug — just what I'm using here. There are plenty of other options, and the AI knows how to work with them.)

Here's the nice part: this kind of integration is already industry standard. When I tell the AI to release this thing, it uses my **GitHub repository** (more on GitHub in a second), and after a one-time setup it shows up on Railway automatically.

That first-time setup might mean clicking a few things myself — set up a new project, find the repo, hit deploy. The AI can probably do most of it; here I just want to do it by hand to show it working.

### Step One - New App

![New App](/images/vibe-coding-with-confidence/railway-new-app.png)

### Step Two - Pick the Repo

![Pick your Repo](/images/vibe-coding-with-confidence/step-two-pick-your-repo.png)


### Step Three - wait and edit
![Pick your Repo](/images/vibe-coding-with-confidence/railwy-edit-project.png)

### Step Four - generate a url

Just for a moment we will use the built in URL:
![Generate a Domain](/images/vibe-coding-with-confidence/railway-generate-domain.png)


> NOTE: 👇

![Waiting](/images/vibe-coding-with-confidence/cloudflare-waiting.png)

**TIP**

Try running the below command once the Cloudflare shows ready if you still can not connect on your Mac

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```


And then the magic: when I want to make a change, I just push the code and walk away. **Railway redeploys the update on its own.** Hello world → hello world version two. You can already feel how this scales.

Want it on your own fancy domain? Point it through Cloudflare and you're set — which ties right back to that security layer I mentioned.

![Custom Domain](/images/vibe-coding-with-confidence/cloudflare-custom-domain.png)

So now we've hosted a simple asset, it's behind a real domain, and updates are one `git push` away. That's genuinely it.

## 3. GitHub — the concept, not the fear

GitHub came up twice already, so let's name it.

Conceptually, GitHub is just **where your code lives** so that other tools — like Railway — can pick it up and deploy it. That's the whole job to understand for now. It happens to be run by a company (GitHub) in a way that AI uses *beautifully*, but that can also be confusing the first time you see it.

The reassuring bit: the AI can handle most of the GitHub steps for you. It helps to understand what it's doing — that's why I'm naming it instead of hiding it — but you do not need to be a Git wizard to vibe code with confidence.

> 📸 **SCREENSHOT:** the GitHub repo for the to-do app (so the "this is just where the code lives" idea has a face).

Scary moments when you can not "merge" a file without "conflicts" 😱

This can come up and be pretty frustrating but just paste your issue or screenshot into AI and let it help you find the right commands to run. I just had to do it for this article and was told to run:

```
git pull --rebase origin claude/vibe-coding-guide-dgs3ch
```

So bizarre but now so easy!

## Leveling up: the real to-do list with a database

Static files are great, but now I want to actually *save* things. The classic example — our to-do list.

Here's a thing to be careful about when you vibe code: you don't want your to-do list living only in a **browser session.** When you use a tool like Replit or Lovable, there's a layer of built-in prompting that nudges the AI toward building things consistently and "for real." If you're rolling on your own, *you* have to bring that opinion — your own set of requirements, your own sense of how it should be built. (That's exactly what skills/rules files are for, and I'll share some at the end.)

So I'm going to make a new GitHub repo for the to-do app, and I'm going to use a database. There are tons of great database providers — **[Supabase](https://supabase.com/)** is my favorite, so that's what we'll use. I'm leaning on Supabase on purpose, because I'm going to build on its auth and websockets as we go.

My prompt to the AI is roughly:

> "Using anonymous authentication in Supabase, set up a session for me and a to-do list. Save my to-dos using the classic to-do schema. I should be able to mark items as **Backlog, Next, In Progress, and Done**, and drag them from lane to lane — and when I drag one, it updates. If I have another tab open and I move an item, use **websockets** so it shows in both screens."

> 📸 **SCREENSHOT:** the AI prompt + the to-do board rendering for the first time with the four lanes.

> 📸 **SCREENSHOT (or short clip):** dragging a card between lanes and it updating live in a second browser tab — the websockets moment.

### The one careful bit: public vs. private

When you build a web app, there are two parts that really matter: the **front-facing / public part**, and (when you have one) the **back-facing / API part.**

In a lot of setups, when you see a variable prefixed with `VITE_` (or similar), you're looking at something that gets shipped to the **front-facing** part — meaning **users can see it.** So don't put anything in there you don't want the public to see. That's the whole rule.

This is exactly why I love Supabase: they *understand* this split, and they let you do a surprising amount safely on the public side while keeping a secure foundation underneath. We'll lean on that next.

> 📸 **SCREENSHOT:** Supabase keys screen, highlighting which key is the public/anon one (the safe-to-expose one).

## Adding real authentication

So far we've used anonymous auth — fine for a session. Now I want real accounts, so I get **private state** (my tasks are mine) and the option of **shared state** later (a team board you log into).

Still using Supabase, but the big rule applies to every auth system: **never roll your own.** There are plenty of proven options — pick one.

Here's where having an opinion pays off again. I tell the AI:

> "Using Supabase, let people register and log in. They don't need to verify their email, they can use magic links to sign in. Sign-up is open."

That's wide open on purpose — you can tighten it however you like (even invite-only). Then, since I'd already set up anonymous auth, I just say:

> "Remove the anonymous auth feature."

…to keep things simple, and now we have a to-do system **stored per user, behind a login.**

> 📸 **SCREENSHOT:** the new login / magic-link screen in front of the to-do board.

> 📸 **SCREENSHOT:** an incognito window hitting the app and being asked to log in (proving the gate works).

### The part people forget: row level security

This is important. Depending on your database setup, the gate on the *front* isn't enough — you also want the **database itself** to enforce that people can only touch their own rows. Supabase calls this **Row Level Security (RLS)**, and I just have the AI make sure it's turned on and the policies are right.

> 📸 **SCREENSHOT:** Supabase RLS policies enabled on the to-dos table.

A couple of freebies worth naming: with Railway you already get **HTTPS** out of the box (certificates are free), so that box is checked. If your host doesn't default to HTTPS, go get that in place.

So now we've got: authentication, row level security, sensible permissions. That keeps your app secure and ready at the baseline. Not bulletproof — nothing is — but sensible.


### Cloudflare Proxy

![CloudFlare Proxy](/images/vibe-coding-with-confidence/cloudflare-proxy.png)


The proxy (that "orange cloud" toggle next to your DNS record) is a great way to get some instant baseline "security" on your project — I put "security" in quotes on purpose, more on that in a second. A few quick wins the moment you turn it on:

- **It hides your origin.** Visitors hit Cloudflare instead of your Railway app directly, so your real server isn't just sitting out in the open for someone to poke at.
- **HTTPS everywhere, free.** You get SSL at the edge, and you can flip on "Always Use HTTPS" so anyone who shows up on `http://` gets bounced to `https://`.
- **DDoS protection out of the box.** Cloudflare soaks up the big, dumb traffic floods at the network level before they ever reach you — included even on the free plan.
- **A CDN you didn't have to set up.** Your static stuff gets cached and served from somewhere near your visitor, so it's faster *and* your origin gets hit less.
- **Bot Fight Mode.** One toggle that knocks back a lot of the low-effort bots and scrapers.
- **Simple firewall rules.** Block an IP, block a whole country, or throw up an "Under Attack" challenge page if something's going sideways — all from the dashboard.

Now the honest part (this is why "security" is in quotes): the proxy is a *baseline*, not a force field. It's a great layer to put in front of the real work — your auth and row level security — not a replacement for it. Same theme as the rest of the article: layers, start simple, nothing's bulletproof.



## The fun finale: give your app its own agent

Here's the part I'm most excited about, and where **Zapier** comes in.

When everything's working, you honestly start treating your app like Dropbox — stuff just syncs and shows up. So let's make that real: I want a little **agent** that syncs tasks *from one of my own systems* into this to-do app. In the demo, it pulls tasks from **Google Tasks** so that when I make a task on my phone, it shows up here.

The usual headache with connecting two services is all the credential and authentication plumbing. This is exactly what an **SDK** is for — *Software Development Kit* — and **Zapier's SDK** lets me wire my vibe coded app up to an outside service without me having to deal with all that complexity myself.

> 📸 **SCREENSHOT:** the Zapier SDK connection / config step.

> 📸 **SCREENSHOT:** the Railway service running the sync agent.

> 📸 **SCREENSHOT (or clip):** add a task in Google Tasks on the phone → it appears in the to-do board.

And here's the spin that makes this genuinely cool: this isn't "one big shared bot." **Each person can host their own agent, wired to their own systems, with their own access.** Your agent reaches *your* stuff. That's a really nice place to land — your own little system, talking to your other systems, on your terms.

> 📸 **SCREENSHOT:** the final board with a synced task highlighted, to close the loop on the whole build.

## Wrapping up

We went from a static "hello world" to a hosted artifact, added a database and a real to-do board, put proper authentication and row level security in front of it, and finished with our own agent syncing from a system we already use — all vibe coded.

None of the three scary things turned out to be that scary:

- **Security** scales with complexity — start simple, stay safe, layer in auth + RLS as you grow.
- **Hosting** is a `git push` away once Railway is pointed at your repo.
- **GitHub** is just where the code lives so the host can grab it.

That's vibe coding with confidence.

So here's the only call to action that matters: pick one idea that's been stuck in your head, open up your AI tool, and ask it for a static "hello world." That's it. That's the first step. Everything else in this article just builds on that one move.

> 🛠️ **Skills & files:** here are the rules files I used to keep the AI building things *my* way — the opinions that replace what Lovable/Replit bake in for you. Drop the `CLAUDE.md` into a fresh repo and start from it: [vibe-coding-with-confidence skill files](https://github.com/alnutile/astro-and-zapier-chat/tree/main/skills/vibe-coding-with-confidence).
