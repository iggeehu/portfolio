---
id: "os-day-2"
title: "Speed-running OS day 2: Learning Assembly Language (by Parsing Context-Switch Code)"
date: "2023-03-08"
keywords: "Keywords: Operating Systems"
---

# Speed-running OS day 2: Learning Assembly Language (by Parsing Context-Switch Code)

![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

[Tianci Hu Marrero](https://medium.com/@iggeehu?source=post_page-----b82dd7561c4--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2Fbb53780bb5a1&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40iggeehu%2Fspeed-running-operating-systems-day-2-learning-assembly-language-by-parsing-context-switch-code-b82dd7561c4&user=Tianci+Hu+Marrero&userId=bb53780bb5a1&source=post_page-bb53780bb5a1----b82dd7561c4---------------------post_header-----------)

7 min read·Mar 14

\--


Today I am striving to understand how context switching is implemented in Assembly Language. The learning curve is a bit steep since I do not know X86 Assembly language or concepts like Kernel stack. So I will research these concepts first before diving into the sample code on the [Three Easy Pieces book](http://ostep.org) (p-90).\
\

## **ALL ABOUT CONTEXT SWITCH**  
  

Context switching is the OS going from running one process to running another. It is one of the most important jobs an OS does to maintain control of processes and optimize resource (CPU) allocation. Before looking at the code, I’ll quickly run through different styles of _virtualizing CPU_ (a fancy way of saying serving CPU for use by processes while maintaining control).\
\
- **Direct Execution**: running processes on CPU directly. This is basically like unleashing the process onto the CPU, unsupervised. **_There is no way for the OS to stop this process or make sure it doesn’t do anything wild._** But the advantage is it’s extremely fast.\
\
- **Limited Direct Execution**: In this method, _kernel mode_ and _user mode_ are invented to solve two problems faced by Direct Execution — **how does a process run restricted operations**, and **how does the OS switch between processes**? (We could let the process do whatever it wants but that would’ve kneecapped most systems we enjoy today). Kernel mode can do whatever it wants, user mode cannot. However, with _trap and return-from-trap,_ user can request a privileged operation. At boot, the OS initializes a trap table for later use. Code in user mode can call trap, which triggers the hardware to switch to kernel mode. The kernel will do the syscall. When it finishes doing so, it calls **return-from-trap** to hand the CPU back to the process.\
\  
## **PARSING THE CODE, and PERIPHERAL KNOWLEDGE**\
\
In the book, there is an example of the xv6 context switch code. I’ll try to parse the first part of this code (line 8–16) in this blog post.\
\
In the book, the author explains how context switch from process A to process B is done. I will paraphrase: **_context switch first saves current register values of A into the Proc Struct of A (argument: old), and load B’s Proc Struct (argument:new) into the registers._**\
\
I am not familiar with the proc and context struct. I don’t know assembly language either. So I did some quickly googling on the key terms and syntax.\
\
**Key terms and Data Structure:**\
\
- **User mode stack VS kernel stack** (kstack): each process has a user mode stack and a kernel stack. When context switch happens, the kernel stack can save state of the process to be resumed later. When a process makes a syscall, the CPU switches from user mode to kernel mode, where the process’ kernel stack keeps state of the calling process. Think of the process’ kernel stack as a ‘hand-off’ point, or a diplomatic division, while the ‘user mode stack’ is more domestic.\
\
- **Proc struct and context struct:** The code snippet operates on these two data structures. Here is an example of proc struct (original [link](https://course.ccs.neu.edu/cs3650/unix-xv6/HTML/S/98.html#L44) here):\
\

```
struct proc {
  56   uint sz;                     // Size of process memory (bytes)
  57   pde\_t\* pgdir;                // Page table
  58   char \*kstack;                // Bottom of kernel stack for this process
  59   enum procstate state;        // Process state
  60   int pid;                     // Process ID
  61   struct proc \*parent;         // Parent process
  62   struct trapframe \*tf;        // Trap frame for current syscall
  63   struct context \*context;     // swtch() here to run process
  64   void \*chan;                  // If non-zero, sleeping on chan
  65   int killed;                  // If non-zero, have been killed
  66   struct file \*ofile\[NOFILE\];  // Open files
  67   struct inode \*cwd;           // Current directory
  68   char name\[16\];               // Process name (debugging)
  69 };
```

And this is the context struct which the original code snippet operates on:\
\
  
```
struct context {
  45   uint edi;
  46   uint esi;
  47   uint ebx;
  48   uint ebp;
  49   uint eip;
  50 };
```\
\
- **%eax, %ebx, %ebp, %edi, all that good stuff**: these are registers that serve different functions, the following graph explains it quite well. eax, ebx, ecx, edx (their 16-bit hind-regions: ax, bx, cx, dx and 64-bits counterparts: rax, rdx, rcx, rdx) are **data registers.** Esp, ebp (their 16-bit hind-regions: sp, bp) are **pointer registers**. Esi and edi (their 16-bit ancestors: si and di) are **index pointers.** A\\B\\C\\D here refer to Accumulator\\Base\\Counter\\Data, SP\\BP refer to stack pointer and base pointer. SI\\DI refer to source index and destination index. The [‘Introduction to Assembly Language’ in the Stanford CS107 course](https://web.stanford.edu/class/archive/cs/cs107/cs107.1234/lectures/09/Lecture09.pdf) has a few very useful slides about how registers are conventionally used.\
\
**Required Syntax:**\
\
- ‘_movl var, %eax_’ - move the value at memory location _var_ to register _eax_.\
\
In line 8, we have an example of this syntax:\
\
```
movl 4(%esp), %eax
```

What we are doing is **loading the 32-bit value (the ‘l’, or referred to as ‘double word’, with each word being 16-bit) which resides at memory address stored _at 4(%esp)_ into register _eax_**_._ And why is _4(%esp)_ a memory location rather than the register itself? This is because () indicates the entity stored at the address stored at whatever is inside the parenthesis.\
\
To rehash*: %esp* is the value inside the register. _(%esp)_ is the value stored at the address kept in the register. _4(%esp)_ is the content that resides at the address stored at location %esp+4.\
\
If you want to learn more about Assembly Language syntax, you can check out the ‘Assembly’ chapter of [Stanford CS107](http://web.stanford.edu/class/cs107/).\
\
Equipped with the basic syntax, we can look at the first block of code in the switch function again:\
\
**line 8** can be explained thus: move the value that resides in location which is 4 more than the stack pointer (stack address) into eax. Perhaps a crude picture representation can help:\
\
Since esp is a stack pointer, we know we are going to a stack by dereferencing the value stored in esp. I was confused by why we must go 4 more than the stack pointer in _4(%esp)._ This led me to learn a few things about stack:  
\
1.  Newer data pushed onto a stack has decreasing memory address. So by going up the address, we are finding an older pointer. Now, the ‘store the old ptr into eax comment” finally made sense to me.\
\
2.  Each increment of 1 in the memory address represents a byte of space. An increment of 4 will give us a unit of 4 bytes. Which is the unit size of data in our stack. (Probably need to look into this further).\
\
Since we know from the comments that the first block of code is saving register values in a struct context, and there is a lot of ‘movs’ into 0(%eax), 4(%eax)… in the following lines, 0(%eax) is probably the old struct _(old_ argument of the function) where we are storing info of the current process to be tucked away. In line 9:\
\
```
popl 0(%eax)
```
\
We are basically popping the **pointer to the _old_ context struct** off the stack (with the side effect of moving esp address up) and storing it in %eax.\
\
Sine 4(%esp) conventionally is the first argument of a function call, and the first argument of the function is _old_, and 4(%esp) got moved to %eax — I am more confident in my understanding of this code.\
\
That’s it! It’s been a process understanding this code. To rehash what I learned trying to decipher this code:\
\
1.  %register is the value inside the register, (%register) is the value pointed to by address(pointer) %register, number(%register) is the value pointed to by address %register+number.\
2.  esp stores the pointer that points at the top of the stack. When you pop and push in assembly language, this pointer value moves down (new equals lower address value) and up (old equals higher address value).\
3.  _pop var_ = pop the newest value from stack and store it in var. _push var =_ push value var onto the stack. Pop’s var is a container, push’s var is the subject to be moved into the container(stack).\
4.  When a function calls, the arguments get pushed onto the stack first, and then the return address.\
\
I also found a great video that explains stack and esp etc very well: [The Stack and ESP in Assembly Language](https://www.youtube.com/watch?v=RU5vUIl1vRs).\
\
Finally, after a whole week stuck on this code, I can move onto scheduling & concurrency.
