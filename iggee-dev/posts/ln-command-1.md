---
id: "ln-command-1"
title: "What the hell is inside the ln command 1/2"
date: "2023-06-16"
keywords: "Keywords: Linux, Unix, Gnulib"
---

# What the hell is inside the ln command 1/2

I have a bad habit that I occasionally indulge in, which makes it very hard for me to finish any books: going into rabbit holes. Recently, I was reading the book “Understanding The Linux Kernel”, and was caught up in the “Hard and Soft Link” section on page 14. Obviously, the rabbit hole happened before I went very far. On the page is the following text:

```
The Unix command:
$ ln p1 p2
is used to create a new hard link that has the pathname p2
for a file identified by the pathname p1.

Hard links have two limitations:
\- It is not possible to create hard links for directories.
Doing so might transform the directory tree into a graph with
cycles, thus making it impossible to locate a file according to
its name.
```

A self-referential directory going in an infinite loop? I had the curiosity to look into the `ln.c` source code in the [coreutils](https://github.com/coreutils/coreutil) library.

After 5 minutes of reading the code and perspiring generously, I decided maybe it’s wise to look at the manpage for ln first. After all, it’s better to know what something is supposed to do, before looking at how it is done.

Below is the elegant explanation of the `ln` command:

```
SYNOPSIS
 ln \[OPTION\]… \[-T\] TARGET LINK\_NAME
 ln \[OPTION\]… TARGET
 ln \[OPTION\]… TARGET… DIRECTORY
 ln \[OPTION\]… -t DIRECTORY TARGET…

DESCRIPTION
 In the 1st form, create a link to TARGET with the name
 LINK\_NAME. In the 2nd form, create a link to TARGET in the
 current directory. In the 3rd and 4th forms, create links
 to each TARGET in DIRECTORY. Create hard links by default,
 symbolic links with - symbolic. By default, each destina‐
 tion (name of new link) should not already exist. When cre‐
 ating hard links, each TARGET must exist. Symbolic links
 can hold arbitrary text; if later resolved, a relative link
 is interpreted in relation to its parent directory.
```

I tried out the first form like so:

I created two files in my Downloads/BOOK directory, `file 1` and `file 2`. I created file1 to be `TARGET` and file2 to be `LINK_NAME`. I thought that I needed to create `LINK_NAME` before mapping `TARGET` as its destination. And when I tried `ln file1 file2`, I was told “failed to create hard link ‘file2’: File exists”, which means, “Hey, this name file2 is taken, come up with a new link name!”

Ok, ok. I wrote ‘ln file1 file3", and assumed that this command will create a new file, file3. I peeked into file3. And nicely, it gives me the same content as file1. We created a portal into file1.

Now my question is: are file1 and file3 the same kind of files? Is file3 a special kind of secondary pointers to file1, the ‘original’, or are both files of exactly the same kind, but separate portals into the same content on disk? What is the data structure of a “hard link”? Are all ordinary files just hard links? I had a little exposure to the idea of fd (file descriptors) and inode. But I don’t quite fit all the knowledge together. Here is what I know:

- A file is a sequence of bytes.
- An inode is a data structure kept by the file system to describe a file. The inode contains information such as file type, file length, device types, etc.
- A file descriptor is a unique identifier to an open file.

I decided to overlook the more complex ways this command can be used, and went on a hunt for the answer for my specific command `ln file1 file3` in the source code.

Since the source code will surely encompass all the options. And I am only inquiring form 1 of the command:

```

ln \[OPTION\]… \[-T\] TARGET LINK\_NAME (create a link of LINK\_NAME of TARGET, put it in current directory)
```

I need to narrow down what to look for in the source code. First, I should seek the `-T` block, which, according to the manpage, means “no target directory”.

```
 -t, --target-directory=DIRECTORY
              specify the DIRECTORY in which to create the links

       -T, --no-target-directory
              treat LINK\_NAME as a normal file always
```

Looking down the `main()` of `ln.c`, I found what I am looking for:

```

int
main (int argc, char \*\*argv)
{
   //parsing all the options, throwing errors
   //on non-legit args, basically busywork stuff
   ...

    if (n\_files == 2 && !target\_directory)
        link\_errno = atomic\_link (file\[0\], AT\_FDCWD, file\[1\]);

      if (link\_errno < 0 || link\_errno == EEXIST || link\_errno == ENOTDIR
          || link\_errno == EINVAL)
        {
          ...
        }
    }

}
```

So it seems like the operation is done by the `atomic_link` function, and immediately after, we are doing operations based on the result, `link_errno`. Now let’s peek into `atomic_link`:

```

/\* Link SOURCE to DESTDIR\_FD + DEST\_BASE atomically.  DESTDIR\_FD is
   the directory containing DEST\_BASE.  Return 0 if successful, a
   positive errno value on failure, and -1 if an atomic link cannot be
   done.  This handles the common case where the destination does not
   already exist and -r is not specified.  \*/

static int
atomic\_link (char const \*source, int destdir\_fd, char const \*dest\_base)
{
  return (symbolic\_link
          ? (relative ? -1
             : errnoize (symlinkat (source, destdir\_fd, dest\_base)))
          : beware\_hard\_dir\_link ? -1
          : errnoize (linkat (AT\_FDCWD, source, destdir\_fd, dest\_base,
                              logical ? AT\_SYMLINK\_FOLLOW : 0)));
}
```

First of all, I am sure whoever wrote this nested conditional operator probably had a lot of fun.

Second of all, my first file, file1, or `TARGET`, is passed as `source`. `AT_FDCWD` has “FD” (file descriptor) and “CWD” (current working directory), it’s safe to assume int `AT_FDCWD`, passed in as `destdir_fd` is just the file descriptor of my current directory. Also, since I passed relative paths in my original command, it makes sense for the function to pass in my current directory. And my `file3`, or `LINK_NAME`, is passed as `dest_base`.

Now it’s time to parse this nested conditional operator into human-readable pseudocode:

```
IF symbolic\_link (I won't need this, bc the default is hardlink):

    relative ? -1
             : errnoize (symlinkat (source, destdir\_fd, dest\_base))


IF not, or hard link (I need this):
    beware\_hard\_dir\_link ? -1
          : errnoize (linkat (AT\_FDCWD, source, destdir\_fd, dest\_base,
                              logical ? AT\_SYMLINK\_FOLLOW : 0)));
```

A quick look at `beware_hard_dir_link` just shows that this is a warning about making a hard link of directories:

```
/\* If true, watch out for creating or removing hard links to directories.  \*/
static bool beware\_hard\_dir\_link;
```

So it seems like if we try to create a hard link of directories, the function will return -1, AKA spit us out and refuse our rude request. Otherwise, we get to finally (note: definitely not finally) do the linking:

```
linkat (AT\_FDCWD, source, destdir\_fd, dest\_base,
                              logical ? AT\_SYMLINK\_FOLLOW : 0))

```

Now, I need to determine whether `logical` is true. The Manpage explains logical as such:

```
 -L, --logical
              dereference TARGETs that are symbolic links
```

Since I did not pass in the L argument, and my target is not a symbolic link, safe to say the logical is false and our flag value is 0.

After a while of poking at the gnulib files, I finally found the implementation of [linkat](https://github.com/coreutils/gnulib/blob/master/lib/linkat.c):

```
linkat (int fd1, char const \*file1, int fd2, char const \*file2, int flag)
{
  if (flag & ~AT\_SYMLINK\_FOLLOW)
    {
      errno = EINVAL;
      return -1;
    }
  return at\_func2 (fd1, file1, fd2, file2,
                   flag ? link\_follow : link\_immediate);
}
```

Ok, turns out linkat is yet another wrapper function. It wraps at_func2, which “translates” our flag of value 0 into the `link_immediate`, whatever that means. Let’s conjure up the signature of [atfunc2](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwj6s5v4n8j_AhW1kYkEHZXzBFUQFnoECA0QAQ&url=https%3A%2F%2Fsvn.netlabs.org%2Frepos%2Fports%2Fcoreutils%2Fvendor%2F8.25%2Flib%2Fat-func2.c&usg=AOvVaw3caZgzWXz0ipPnRdzRsFUC) (warning, this is a direct download of a c file):

```
/\* Call FUNC to operate on a pair of files, where FILE1 is relative to FD1,
   and FILE2 is relative to FD2.  If possible, do it without changing the
   working directory.  Otherwise, resort to using save\_cwd/fchdir,
   FUNC, restore\_cwd (up to two times).  If either the save\_cwd or the
   restore\_cwd fails, then give a diagnostic and exit nonzero.  \*/
int
at\_func2 (int fd1, char const \*file1,
          int fd2, char const \*file2,
          int (\*func) (char const \*file1, char const \*file2))
```

Voila, link_immediate turns out to be a function. The plot thickens (or continues to unwrap).

At this point, we have looked so many signatures, we forgot which of TARGET (file1), LINK_NAME(file3), and AT_FDCWD(current directory) is passed in as which argument. Let’s stack it down:

```
(TARGET=file1 LINK\_NAME=file3)

ln file1 file3
main() (of ln.c)
atomic\_link (char const \*TARGET, int AT\_FDCWD, char const \*LINK\_NAME)
linkat (AT\_FDCWD, TARGET, AT\_FDCWD, LINK\_NAME,
                              logical ? AT\_SYMLINK\_FOLLOW : 0))

atfunc(AT\_FDCWD, TARGET, AT\_FDCWD, LINK\_NAME, link\_immediate)


```

Are we there yet? I don’t know, but it seems like we might call link_immediate which takes TARGET, LINK_NAME, and our current directory as arguments. Reading down the atfunc2 function, a very nice person has written some human-readable text. And I neatly found my specific situation among them:

```
/\* There are 16 possible scenarios, based on whether an fd is
     AT\_FDCWD or real, and whether a file is absolute or relative:

         fd1  file1 fd2  file2  action
     0   cwd  abs   cwd  abs    direct call
     1   cwd  abs   cwd  rel    direct call
     2   cwd  abs   fd   abs    direct call
     3   cwd  abs   fd   rel    chdir to fd2
     4   cwd  rel   cwd  abs    direct call
\*\*\* THIS IS US, YAY!!!
     5   cwd  rel   cwd  rel    direct call
\*\*\* THIS IS US, YAY!!!
     6   cwd  rel   fd   abs    direct call
     7   cwd  rel   fd   rel    convert file1 to abs, then case 3
     8   fd   abs   cwd  abs    direct call
     9   fd   abs   cwd  rel    direct call
     10  fd   abs   fd   abs    direct call
     11  fd   abs   fd   rel    chdir to fd2
     12  fd   rel   cwd  abs    chdir to fd1
     13  fd   rel   cwd  rel    convert file2 to abs, then case 12
     14  fd   rel   fd   abs    chdir to fd1
     15a fd1  rel   fd1  rel    chdir to fd1
     15b fd1  rel   fd2  rel    chdir to fd1, then case 7

     Try some optimizations to reduce fd to AT\_FDCWD, or to at least
     avoid converting an absolute name or doing a double chdir.  \*/
```

So the commenter prescribed ‘direct call’ to us, call what? `link_immediate`? Immediately after this block of comment, I found out I was right.

```
if ((fd1 == AT\_FDCWD || IS\_ABSOLUTE\_FILE\_NAME (file1))
 && (fd2 == AT\_FDCWD || IS\_ABSOLUTE\_FILE\_NAME (file2)))
 return func (file1, file2); /\* Case 0–2, 4–6, 8–10. \*/
```

Ok, for us, that’s `link_immeidate(TARGET, LINK_NAME)` ! Praise the lord and let this be our final function-hop. I am back to gnulib/lib/linkat.c to figure out what `link_immediate` does:

```
static int
link\_immediate (char const \*file1, char const \*file2)
{
  char \*target = areadlink (file1);
  if (target)
    {
      ,.
}
```

We get a target value from `areadlink`, what does `areadlink` do? I dug into gnulib again.

```
/\* Call readlink to get the symbolic link value of FILENAME.
   Return a pointer to that NUL-terminated string in malloc'd storage.
   If readlink fails, return NULL and set errno.
   If allocation fails, or if the link value is longer than SIZE\_MAX :-),
   return NULL and set errno to ENOMEM.  \*/

char \*
areadlink (char const \*filename)
{
  return careadlinkat (AT\_FDCWD, filename, NULL, 0, NULL, careadlinkatcwd);
}
```

Since there is no symbolic link of my file, I believe target in `link_immediate` will return null. So let’s look at the if block that fits the null scenario:

```
static int
link\_immediate (char const \*file1, char const \*file2)
{
  char \*target = areadlink (file1);Aha! Now we are at link. I start peeking into the code.

\#   define CreateHardLinkFunc CreateHardLink

int link (const char \*file1, const char \*file2)
{
  char \*dir;
  size\_t len1 = strlen (file1);
  size\_t len2 = strlen (file2);

  .../\* Handling errors, trimming unwanted slashes, safety check, etc

  /\* Now create the link.  \*/
  if (CreateHardLinkFunc (file2, file1, NULL) == 0)
    {
      /\* It is not documented which errors CreateHardLink() can produce.
       \* The following conversions are based on tests on a Windows XP SP2
       \* system. \*/
      DWORD err = GetLastError ();
      switch (err)
        {
        ...
        }
      return -1;
    }

  return 0;
}


  if (target)
    {
      ...//WE DONT CARE
    }
  if (errno == ENOMEM)
    return -1;
  //WE CARE
  return link (file1, file2);
}
```

Let’s stop here for now. I must feed the dogs and attend my neglected household. My hope is that soon I will catch sight of an inode or two soon, and the magic demystified.
