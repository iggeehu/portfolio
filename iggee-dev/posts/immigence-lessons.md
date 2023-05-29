---
title: "Things I learned building my first data pipeline & crawler project"
date: "2023-05-23"
---

# Things I learned building my first data pipeline & crawler project

[![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

](https://medium.com/@iggeehu?source=post_page-----b4b47e3bb1db--------------------------------)

[Tianci Hu Marrero](https://medium.com/@iggeehu?source=post_page-----b4b47e3bb1db--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2Fbb53780bb5a1&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40iggeehu%2Fthings-i-learned-building-my-first-data-pipeline-crawler-project-b4b47e3bb1db&user=Tianci+Hu+Marrero&userId=bb53780bb5a1&source=post_page-bb53780bb5a1----b4b47e3bb1db---------------------post_header-----------)

6 min read·Mar 6

\--

In early February 2023, inspired by my gruesome 10-month immigration wait (no work permit, no driver’s license…), I decided to make a USCIS immigration data crawler & pipeline project. The idea is simple: whenever the user queries their own case on my site, I will return data insights on the case range (unit is 5000) in which their case number falls. For example, if I put in immigration case ABC000235, I will return data about cases ABC000000-ABC005000. Users can learn how many of the cases in their range are I485 (permanent resident) or I765 (work authorization), or others, like so:

and the approval (& other status) trend per case type, like so:

Like all projects, the steps seemed simple and straightforward. I should:

1.  Figure out how to scrape result from the USCIS website, for they do not have an API.
2.  Scrape tens of thousands of cases per day, store them in a database effectively and cheaply.
3.  Display them with a data visualization toolkit.

However, the implementation turned out to be tricky and delicate. After a month of chipping away at the idea and learning a ton of new libraries like Bokeh and Python Signal Module, I came up with a minimally viable site: [immigence.herokuapp.com](http://immigence.herokuapp.com).

This project sounded daunting for a self-taught programmer who had never coded in Python, web-crawled anything, done anything data-related, or deployed a project on AWS/Heroku. But I knew that I had the knowledge to know where to look when I don’t know things, and it was not _impossible_.

As it always turned out, the steepest-yet-impossible projects always taught me the most. And I would like to share my lessons.

1.  **Radical Performance Improvement Is Amazing, but Future-Proof It.**

Having just read _Designing Data Intensive Applications,_ I was cocky and knew that I wanted to do some swanky performance-optimized database design. Here is something I came up with: I would not keep discreet cases in my database but only the ‘meta-data’, so to speak. In this way, I didn’t have to keep millions of rows each representing a case but only tables (each representing a case range) keeping track of the number of cases under each approval stage.

I was quite proud of this until I wanted to add a new feature: to provide the case numbers that are approved today on my front page. To do this, I needed to keep discreet cases in rows and track their status. And it turned out (as someone unaware of how expensive & cheap different computing types are), I was already making requests of all the cases, it was not that much more expensive to write them into the database.

In the end, I kept some of the optimizations I came up with at the beginning. For example, I only scraped cases that are 1 step before approval daily, in case I failed to put them on the “approved today” tab. The rest of the cases moved much more slowly and was less likely to change status. So I scraped them once every three days.

**I was glad I went into the database design stage with performance-in-mind, but for the app features to be elastic and future-proof, sometimes we need to make a choice.**

**2\. Reading Library Source Code When The Documentation Is Too High-Level**

Library documentation comes in all styles. The [Bokeh Library](https://docs.bokeh.org/en/latest/index.html) focuses on giving you an abundance of code examples rather than explaining _what the code does_, so that you can quickly come to your conclusions and forge your graph. The [Redis Queue](http://python-rq.org) library is concise and minimalist, expecting you to know how somethings work underneath (for example, library import path and custom worker class). The [Selenium library](https://www.selenium.dev/documentation/webdriver/getting_started/first_script/), by the time I used it, was flat-out incomplete and had no examples.

Like Robert Martin said in _Clean Code,_ good code should be self-explanatory and expressive. Luckily, most of the libraries are just like that. When I found the documentation to be lacking, it was easier to go back to the source of truth than on Stackoverflow. The Redis Queue worker class source code had all I needed to know about making a custom worker. And funnily, the Selenium code base basically had documentation built-in in the form of comments.

**3\. Functions should do one thing, and half (proofing itself from interrupted premises).**

The half thing is to check the previous function/jobs which serve as its premise. For example, in my project, when I started with a new range of cases, I had to do the following:

1.  Create a table named after the rangeId, where I keep discrete cases.
2.  Populate the table with rows, initializing all the case number column, leaving all the other columns _null_.
3.  Start the first daily scrape job of the 5000 cases.
4.  When the scrapes are done, create a new table in the ‘Range Log’ schema to keep track of today’s numbers under each approval stage.
5.  Fill out the range log table for this range, specifying how many I-485 (Permanent Resident) cases are ‘interview ready’, ‘rejected’, ‘further evidence requested’, ‘approved’, etc.

This sounds simple enough, but alas — real life was far from simple. Sometimes I lost my db connection while step 2 is in process, and step 3 started, which threw an exception, since it could not find the row with the case number (because it failed to initialize in the previous step). Sometimes, USCIS got mad at my requests and cut off my RQ scrape job. With only 580 cases scraped out of 5000, the range log operation (step 4, 5) continued to fill out old or empty results. **_This was where I learned a valuable lesson: each simple function/job that depends on previous steps must check for failures of the previous functions/jobs. The functions need to be encapsulated, yet aware of its context._** Perhaps this is just another way of saying “do exception handling well”, but this is a different angle to look at it.

In my project, I ended up putting checks before my functions to ensure the success of the previous step. If not, I prompt the previous step again before proceeding. If this breaks the “clean code” principle, you could simply write a wrapper function that does nothing but add this level of error handling. If my 5000-case scan job was interrupted, I didn’t want to start from case 0 again, since it was already scanned. To solve this inefficiency, instead of algorithmically generating the case numbers, I dynamically extracted them from the db, adding the condition “select the cases last scanned more than 24 hours ago.” Now, I could pick up right where I started.

**4\. Slow is faster**

This one is different from the previous lessons. This one is quite metaphysical. Since no part of this project was something I’d done before, I often ran into bugs that felt too difficult to fix. After a while, I realized it was not that they were hard to fix, but I was in a “developer’s mental spiral”. I was losing confidence at my ability to find the right solution, that sometimes I didn’t even finish reading the stackoverflow page or documentation. I opened new pages, read a few lines. Before I fully grasped what was being said or know if it answered my question, I closed the window in a fit of frustration.

This got really bad when one day, I failed to make an experimental navbar to work and tried to reverse the changes. I did the wrong git command and got a ‘detached head’, AND only a few files got reverted, which rendered my whole project in a Frankenstein state. I was not expecting to run into this issue, so I was on a short fuse. I quickly opened a series of tabs, but failed to find my solution.

A few hours later, I was away from my computer and sitting on my couch. I was much more relaxed. I slowly and calmly read through a long article about the difference between git reset & restore & revert. The article took 15 minutes, and it answered all my questions — — Just a few hours before, I spent 35 minutes jumping from tab to tab in a mental spiral, only to solve nothing.

I guess another way to phrase this is — “Unexpected drawbacks are a fact of life, don’t lose your nerve!”

_Check out immigence at immigence.herokuapp.com_
