---
id: "os-day-1"
title: "Speed-running OS-day 1: Basics"
date: "2023-03-08"
keywords: "Keywords: Operating Systems"
---

# Speed-running OS-day 1: Basics

![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

[Tianci Hu Marrero](https://medium.com/@iggeehu?source=post_page-----d61d20cf28f--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2Fbb53780bb5a1&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40iggeehu%2Fspeed-running-operating-systems-day-1-2-d61d20cf28f&user=Tianci+Hu+Marrero&userId=bb53780bb5a1&source=post_page-bb53780bb5a1----d61d20cf28f---------------------post_header-----------)

4 min read·Mar 8

\--

My materials: Stanford CS140 (no videos, only slides) and [‘Operating Systems, Three Easy Pieces’](https://pages.cs.wisc.edu/~remzi/OSTEP/) which is free online.      
     
     


**TASKS OF AN OPERATING SYSTEM**

1.  Control — How to maintain control of the resource (CPU) while giving processes ‘admin powers’ such as read and write from disk.

2.  Protection — How to prevent user (or process) from accessing and clobbering (overwriting) other processes’ memory space. Hint: through CPU virtualization via [address space](https://www.ibm.com/docs/en/zos-basic-skills?topic=storage-what-is-address-space).
3.  Scheduling — How to maximize CPU usage with different techniques, like preemptive/non-preemptive. Scheduling must balance the following goals: fairness, priority, deadlines, throughput, efficiency. With effective scheduling, a single core CPU can create the illusion of executing many processes at once.

**KEY CONCEPTS:**

1.  **OS Kernel**: A computer program that allocates hardware resources to processes and oversees process behaviors. The ‘cockpit’. A layer between hardware and processes. It offers a systems call interface for use by the processes. Fun fact: the oldest operating systems are nothing but a _standard library._ In other words, it does nothing but offers itself up for use by processes and the scheduling/control aspects have to be done by humans.
2.  **Process**: an instance of a running program. Data structures that represent processes: proc in Unix, task*struct in Linux, struct thread in Pintos. These data structures need to contain all the info the process requires to run, such as open files, registers, credentials, priority, process state(running, ready, or blocked), process ID, address space. A process is created via fork() and executed via exec() (These two functions behave with some intricacies that are worth exploring, see p35 of \*\*\_Three Easy Pieces*\*\* book). Here is an example of a process data structure:

This is from the CS140 lecture slide.

**3\. File descriptor**: an ID that identifies a file. In implementation, it represents a stream into or out from a file. For example, the open() procedure call returns a file descriptor. File descriptors are integers. 0, 1, 2 are reserved for standard input (stdin), standard output(stdout), and standard error(stderr).

**4\. System call**: Special functions called by the process that requests ‘privileged functionalities’ outside of the process’ jurisdiction. A process’ request to use OS functionalities such as read/write (e.g open() is actually a system call), printf, or fork. The process makes a system call by executing a **trap** instruction. The OS relinquishes control and then regains control through a **return-from-trap** instruction. The trap instruction is implemented underneath all the system call funcs.

**5\. Call stack:** A last-in-first-out data structure that helps a process remember where to return to (implementation: a return address that points to the memory where the function can pick up right where it started) after running a child function. A stack is like a stack of laundry — the clothes on top (put there last) get picked up first. When a routine is being run and about to start a subroutine, the current line of execution in the routine is ‘pushed’ to the stack. Once the subroutine is finished, the stack ‘pop’ (or remove) the last remembered line, so it can pick up where it started.

6\. [**Registers**](https://www.tutorialspoint.com/assembly_programming/assembly_registers.htm)**:** Think of this as a super-RAM that is much faster than memory. Registers are memory slots that can store data for processing. A process data structure typically contains registers. In assembly language, the registers are represented conventionally by EAX, EBX, ECX, EDX, which are 32-bit, and AX, BX, CX, DX, which are 16-bit, and AH, AL, BH, BL, CH, CL, DH, and DL, which are 8-bit, etc.

7\. **Pre-emption**: CPU’s interference of processes for scheduling/efficiency. Instead of letting a process finish, sometimes the CPU intervenes to determine whether the current process should continue or another process should be in its stead. This is usually done with an interrupt timer. When the timer runs out, the CPU checks in and makes a decision. Non-preemptive scheduling, on the other hand, looks like this: once the CPU is given to a process, the process gets to run its course and terminates before another process is put on queue.

8\. **CPU virtualization**: Another way of saying ‘OS doing its job’, which is transforming hardware into software. In other words, interpreting a physical resource into a virtual form. An OS is sometimes called a virtual machine.

9\. **Memory virtualization (address space):** The OS does this to protect its memory. It translates physical memory into private address spaces. Private address space is a chunk of memory alloted by the OS to a process at the start of the process. Via virtualization, the process can only access its own address space. It has no way of overreaching into other processes’ memory by manipulating physical memory.

10\. **Context switching**: the CPU going from executing one process to executing another process.
