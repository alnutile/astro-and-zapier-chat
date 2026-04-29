---
title: "ActiveRecord and the Beauty Lost in Translation"
date: 2016-01-30
excerpt: "Author: Matthew Machuga Read By: Alfred Nutile Original Source: http://matthewmachuga.com/blog/2015/activerecord-and-the-beauty-lost-in-translation.html"
image: "https://image.simplecastcdn.com/images/2382b3/2382b324-80c9-4307-bfe6-0310a03c767f/2c69b801-29bd-4a41-aa6e-43f525b6352e/3000x3000/1454069381-artwork.jpg?aid=rss_feed"
tags: []
# original_url: https://substack.com/home/post/p-166465063
---

## Author: [Matthew Machuga](http://matthewmachuga.com)

### Read By: [Alfred Nutile](https://twitter.com/alnutile)

### Original Source: [http://matthewmachuga.com/blog/2015/activerecord-and-the-beauty-lost-in-translation.html](http://matthewmachuga.com/blog/2015/activerecord-and-the-beauty-lost-in-translation.html)

Sometime in 2014, PHP-land started to debate whether Active Record was a tolerable ORM pattern, and whether one should use Active Record or Data Mapper ORMs. In PHP, this comes down to something like Laravel’s Eloquent ORM as an Active Record implementation vs. Doctrine, the reigning mainstream (and probably only) PHP data mapper implementation. After a surge of interest in Domain-Driven Design (DDD) and Hexagonal Architecture in the Laravel, and overall PHP communities, people began to detest one of the very things that drew them to the framework in the first place. This was fueled by a number of vocal and notable Laravel community members learning Doctine, talking about it heavily, and some evangelizing it. With outside influence from the PHP world providing the same judgement against the impure Active Record pattern, the pitchforks started to come out from all over.
