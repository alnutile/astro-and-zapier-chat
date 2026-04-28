---
title: "Using Composer Without GitIgnoring Vendor/"
date: 2016-01-21
excerpt: "Author: Lorna Jane Mitchell Read By: Lorna Jane Mitchell Original Source: http://www.lornajane.net/posts/2014/using-composer-without-gitignoring Recent additions to the joind.in API have introduced some new dependencies so we decided we'd start using Comp"
image: "https://image.simplecastcdn.com/images/2382b3/2382b324-80c9-4307-bfe6-0310a03c767f/161cbdcf-4211-4176-903b-37085dd3354c/3000x3000/1453423697-artwork.jpg?aid=rss_feed"
tags: []
# original_url: https://substack.com/home/post/p-166465066
---

## Author: [Lorna Jane Mitchell](http://www.lornajane.net/)

### Read By: [Lorna Jane Mitchell](http://www.lornajane.net/)

### Original Source: [http://www.lornajane.net/posts/2014/using-composer-without-gitignoring](http://www.lornajane.net/posts/2014/using-composer-without-gitignoring)

Recent additions to the joind.in API have introduced some new dependencies so we decided we'd start using Composer to manage these - but we don't want to run composer unsupervised. I'm sure this will bring the rain of "just run composer install, it's probably mostly almost safe" criticism, but actually it's quite tricky to run Composer without excluding vendor/ from source control so I thought I'd share how we did it so that anyone who wants to do so can learn from my experience!

👉🏻 Ai Automation Consulting https://dailyai.studio

👉🏻 Join the NewsLetter https://videos.dailyai.studio/

👉🏻 Buy the book "PHP and LLMs - the practical guide" https://bit.ly/php_llms

---POSTBREAK---

