---
id: "os-day-3"
title: "Speed-running OS day 3: Scheduling"
date: "2023-03-08"
keywords: "Keywords: Operating Systems"
---

# Speed-running OS day 3: Scheduling

![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

[Tianci Hu Marrero](https://medium.com/@iggeehu?source=post_page-----541c0e747a78--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2Fbb53780bb5a1&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40iggeehu%2Fspeed-running-os-day-3-scheduling-541c0e747a78&user=Tianci+Hu+Marrero&userId=bb53780bb5a1&source=post_page-bb53780bb5a1----541c0e747a78---------------------post_header-----------)

3 min read·Mar 19

\--

Listen

Share

Scheduling Mechanisms for Operating Systems

After going through the assembly code part, CPU scheduling is a pleasant change of scenery. The way CPU schedules tasks can be measured by two metrics: **fairness, turnaround time** and **response time**. Turnaround time is the time when the task completes executing minus the time of task arrival. Response time is the time when task is picked up by CPU minus the time of task arrival.

There are a few primitive scheduling methods, and we shall discuss them and their performance in these two metrics.

**_(non-preemptive: running job to completion, uninterrupted; preemptive: the OS might interrupt a job to run another job)_**

**FIFO (first in, first out) — non-preemptive**: the tasks that arrive first will be scheduled and executed til completion, then the next will be scheduled. Each task will be picked up and completed without interruption. The problem with this approach is the dismal turnaround time when you have a big task in front of smaller ones.

**Shortest Job First (SJF) — non-preemptive**: this approach executes the shortest job first. This reduces turnaround time. Also, since it is non-preemptive, a big job can arrive and get started before the smaller jobs arrive. The CPU in this case will run the big job to completion, afflicting itself with the same dismal turnaround time of FIFO.

**Shortest Job To Completion First (STCF) — semi-preemptive:** this approach solves the problem of big tasks arriving before smaller ones. When smaller tasks arrive after a big task has started, the OS stops and measures which one takes the least time to complete and run that one first. This approach is **only preemptive at this point.** After it makes a decision, the jobs will run non-preemptively.

_The above three methods all have bad response time performance (translate to: bad user experience), since they are mostly non-preemptive. New tasks have to wait for old tasks to complete before they run._

**Round Robin — preemptive:** this approach slices jobs to equal time bits and run them in turn. It is very fair, responsive but tend to have poor turnaround time.

**I/O Incorporation — preemptive:** this is not an alternative to the approaches above but just a practice that deals with I/Os which blocks a process. It splits a job up by I/O — everytime a job does I/O, the OS switches to another process. Effectively, a job is split into different de-facto jobs by its I/O breakpoints.

**Multi-level Feedback Queue (MLFQ):** A strategy that strives to solve both the turnaround and response problems. It assigns each job a priority level and runs them in order of priority. There are a few rules: 1. If A has higher priority than B, A runs. 2. If A and B have the same priority, they run in Round Robin. 3. When a job enters the system, it is given the highest priority until proven otherwise. 4. When a job uses up the time slot while running, its priority drops; if it finishes before the time slot runs out, it gets to keep its priority level. 5. After some period, all the jobs get to move to the most-prioritized queue. 6. Once a job uses up its time allotment at a given level (regardless of how many times it has given up the CPU), its priority is reduced.

I feel like rule 4 deserves some explanation, why does a job that uses up a slot gets de-prioritized? This is because it has proven itself to be CPU-intensive, long-running jobs. A job that is the opposite — one which happens a lot but takes little time — is an interactive job. The interactive jobs needs to be prioritized to boost responsiveness and prevent CPU-heavy jobs from clogging them up.

Rule 5 is introduced to solve the risk of potentially starving the long-running jobs when there are too many interactive jobs. Similarly, Rule 6 is introduced to prevent overly interactive short jobs from taking over and programs from gaming the systems for more priority by cutting up its CPU use into smaller slots.
