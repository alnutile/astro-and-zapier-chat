---
title: "Do not fear the Queue!"
date: 2017-06-01
excerpt: "Do not fear the Queue. We talk about how important queues are in our day to day work and design."
image: "https://image.simplecastcdn.com/images/b42305/b4230519-5efc-4cc0-8af0-3a8f3fcf6ab8/0f47b382-3bc2-428b-b618-33722c7095cf/3000x3000/1496321945-artwork.jpg?aid=rss_feed"
tags: []
# original_url: https://substack.com/home/post/p-166464856
---

# News & Other Happenings

## Al (tool/app) Copied – Copy and Paste Everywhere by Kevin Chang

http://copiedapp.com/

Make sure to enable the keyboard
## NK: Intro Video to Pickle - a BDD layer on top of Dusk and PHPUnit

https://www.youtube.com/watch?v=GmA-6hnhljI&feature=youtu.be

https://github.com/alnutile/pickle
## Al: Github moving to GraphQL

https://developer.github.com/v4/
## NK: IBM tells thousands of remote employees to come back to office or find new jobs

https://arstechnica.com/information-technology/2017/05/ibm-to-remote-workers-come-back-to-the-mothership-or-else/
# Deep Dive

Do not fear the Queue
## Queue usage

https://en.wikipedia.org/wiki/Message_queue

The many levels it can benefit your workflow and how you solve problems
## Use Cases

Parallel tasks

Connect two different languages with json

Split up services offload work - Microservice

Allows you to work locally on a part of your App that later you can move off to a microservice or worker

Prevent database sharing

Sending Mail

Importing Files

Database buffer

Long running jobs
## How to Implement

Locally using Sync Driver

Laracast

https://laracasts.com/search?q=Queue

Beanstalk

SQS

Iron

Forge

FortRabbit with CloudAMQP https://help.fortrabbit.com/cloudamqp

Homestead

AWS SQS

S3 for large payloads

How to deploy

Laravel Daemon pretty simple

Database

--simple start

--local jobs vs remote
## Gotchas

Retries

SNS Format

You gotta restart the queue

Interesting how Laravel does it with timestamp

Have wasted a day on this in the past

Logs can will up if queue is erroring out

Failed jobs

Queue has limit 256 k limit

Visibility timeout

Links

Beanstalk

https://laracasts.com/lessons/beanstalkd-queues-with-laravel

etc

https://laravel.com/docs/5.4/queues#supervisor-configuration
link to sns
