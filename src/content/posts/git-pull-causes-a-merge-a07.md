---
title: "Git Pull Causes a Merge"
date: 2016-01-24
excerpt: "Author: Lorna Jane Mitchell Read By: Lorna Jane Mitchell Original Source: http://www.lornajane.net/posts/2015/git-pull-causes-a-merge If you type git pull and expect a fast-forward update, but get a merge instead, don't panic! This usually happens when we"
image: "https://image.simplecastcdn.com/images/2382b3/2382b324-80c9-4307-bfe6-0310a03c767f/b7f86caf-f22a-4bf2-b569-90897698d6f1/3000x3000/1453644249-artwork.jpg?aid=rss_feed"
tags: []
# original_url: https://substack.com/home/post/p-166465065
---

## Author: [Lorna Jane Mitchell](http://www.lornajane.net/)

### Read By: [Lorna Jane Mitchell](http://www.lornajane.net/)

### Original Source: [http://www.lornajane.net/posts/2015/git-pull-causes-a-merge](http://www.lornajane.net/posts/2015/git-pull-causes-a-merge)

If you type git pull and expect a fast-forward update, but get a merge instead, don't panic! This usually happens when we're collaborating on a branch with other people, and we've made changes on our local version of a branch, and someone else (or the other you, if you use git to sync between multiple dev platforms) has made changes to the remote version of a branch in the meantime. It also happens really frequently in teams where all commits are to the master branch ... yet another reason to have a decent branching strategy.
