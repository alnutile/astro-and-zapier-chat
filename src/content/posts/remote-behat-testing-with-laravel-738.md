---
title: "Remote Behat Testing with Laravel"
date: 2016-02-03
excerpt: "Author: Alfred Nutile Read By: Alfred Nutile Original Source: https://alfrednutile.info/posts/177 This document will cover how to use a Behat specific API to setup a site for testing. What this includes is setting up a Scenario so that it has the data you"
image: "https://image.simplecastcdn.com/images/2382b3/2382b324-80c9-4307-bfe6-0310a03c767f/f3af3800-3f17-4751-adb4-764a6de1f55e/3000x3000/1454530239-artwork.jpg?aid=rss_feed"
tags: []
# original_url: https://substack.com/home/post/p-166465062
---

## Author: [Alfred Nutile](https://twitter.com/alnutile)

### Read By: [Alfred Nutile](https://twitter.com/alnutile)

### Original Source: [https://alfrednutile.info/posts/177](https://alfrednutile.info/posts/177)

 This document will cover how to use a Behat specific API to setup a site for testing. What this includes is setting up a Scenario so that it has the data you need to run a test. This makes it possible not to rely on Seed data for this. This will allow us to run behat tests from remote machines as well as run tests in parallel.
