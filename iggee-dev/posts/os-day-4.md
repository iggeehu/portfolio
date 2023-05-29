---
id: "os-day-4"
title: "Speed-running OS day 4: Fair-share and multiprocessor scheduling"
date: "2023-03-08"
keywords: "Keywords: Operating Systems"
---

# Speed-running OS day 4: Fair-share and multiprocessor scheduling

![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

[Tianci Hu Marrero](https://medium.com/@iggeehu?source=post_page-----e4b26704395a--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2Fbb53780bb5a1&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40iggeehu%2Fspeedrunning-os-day-4-fair-share-and-multiprocessor-scheduling-e4b26704395a&user=Tianci+Hu+Marrero&userId=bb53780bb5a1&source=post_page-bb53780bb5a1----e4b26704395a---------------------post_header-----------)

4 min read·Mar 27

\--

**FAIR-SHARE SCHEDULING**

Fair-share scheduler has a different principle compared to those with a mind to optimize turnaround and response time: it guarantees that each job gets its share of the CPU. [**_Lottery scheduling_**](https://en.wikipedia.org/wiki/Lottery_scheduling) is one early example. It probabilistically assigns the CPU by holding a lottery for every time slice. A process will have a number of tickets in proportion to the CPU percentage it is entitled to.

The randomization helps avoid strange edge cases that often ail traditional algorithms and has less overhead or state to keep.

The ticket system can offer a few further functionalities. **Ticket currency** allows a user to distribute its tickets among its own jobs. Then these allocated tickets get translated into global values as the jobs enter the queue to be handled by the CPU. **Ticket transfer** allows a process to hand off its tickets to another process, which is useful for client/server settings. Ticket inflation allows a process to raise or lower the number of tickets it owns (condition that it is in a trustful environment where no malicious actors exist) to reflect its needs.

However, randomness has the drawback of not achieving perfect fairness if the base number of jobs is small.

While lottery scheduling is **randomized fair-share scheduling**, **stride scheduling** is **deterministic fair-share scheduling**. In stride scheduling, each process gets a stride, which is the inverse in proportion to the number of tickets it has. (eg, process A, B, C each has one 50, 100, 150 tickets, and their stride is a large number (let’s say 5000) divided by these ticket numbers: 100, 50, and 33.3. The stride is kind of the like the value of a full process bar, and every time a process is run, we increment the value (called a **pass**) inside this bar. In this scheduling method, the process simply runs the process with the lowest pass value.

**MULTI-PROCESS SCHEDULING**

Many problems arise due to the emergence of multicore CPUs. Typical applications only use one CPU, and adding more CPUs doesn’t make them run faster. This problem is solved by multi-threaded applications that can spread work across multiple CPUs. Another problem is multiprocessor scheduling.

In a single-CPU system, there is a hierarchy of hardware caches (where frequently accessed data is kept) that help the processor run faster. Having two CPUs that share a single memory introduces the problem of **cache coherence,** with the possibility of one CPU’s cache being out of date because the other CPU updated the data. This problem is generally solved by hardware through a technique called **bus snooping,** where the caches subscribe to the bus update (bus: the channel that connects them to main memory). When an update happens, the cache either invalidates the data or updates it.

Another problem faced by multi-process scheduling is synchronization (avoiding two threads writing on the same data at the same time, causing a cascade of problems). This can be solved by **locking** (adding locking and unlocking logic), which ensures that only one thread is writing data at any given time. However, locking comes with overhead and makes access to the data slow as the number of CPUs grows.

Another issue faced by multicore scheduling is **cache affinity.** When a process runs on a particular CPU, it builds up a lot of states in the caches. The next time it runs, it is more advantageous to run it on the same CPU because it would be faster. This is something a multicore processor needs to take into consideration.

**DIFFERENT MULTIPROCESSOR SCHEDULING METHODS**

1.  Single-Queue Scheduling — borrowed from single-processor scheduling

This method puts all jobs into a single queue. In a single processor system, the OS picks the best one job to run. Now in a multiprocessor system, it simply picks the best two or three jobs to run. This type of scheduling is very easy upfront but incurs scalability issues when too many locks become necessary for cache coherence. It also could result in jobs being bounced from CPU to CPU. The CPU-bouncing problem can be solved with some sort of affinity mechanism.

2\. Multi-queue scheduling

Some systems use multi-queue scheduling to avoid the pitfalls of single-queue schedulers. In this scheduling style, every CPU gets its own queue. MQMS intrinsically provides cache affinity: jobs stay on the same CPU and can reap the advantage of reusing cached contents.

On the other hand, multi-queue scheduling has the problem of **load imbalance**. For example, if CPU 0 has job A, and CPU 1 has job B and D, when CPU 0 finishes, it will sit idle while CPU 1 is still busy with two jobs. This problem can be solved with job migration. Migration can be triggered through **job stealing —** the process of relatively idle CPU peeking into the queue of another CPU and making a decision whether or not to steal the other CPU’s jobs.
