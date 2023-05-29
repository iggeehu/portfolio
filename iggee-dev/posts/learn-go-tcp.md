---
id: "go-tcp-server"
title: "Learning Go by writing a simple TCP server"
date: "2023-05-25"
keywords: "Keywords: TCP/IP, Golang, Protohackers"
---

# Learning Go by writing a simple TCP server

![Tianci Hu Marrero](https://miro.medium.com/v2/resize:fill:88:88/1*Odrk7Jy6oAm7HfQyBq92hA.png)

[Tianci Hu Marrero](https://medium.com/@iggeehu?source=post_page-----d8ed260f67ac--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2Fbb53780bb5a1&operation=register&redirect=https%3A%2F%2Fmedium.com%2F%40iggeehu%2Flearning-go-by-writing-a-simple-tcp-server-d8ed260f67ac&user=Tianci+Hu+Marrero&userId=bb53780bb5a1&source=post_page-bb53780bb5a1----d8ed260f67ac---------------------post_header-----------)

\--

At the beginning of my batch at Recurse Center, I committed to joining the Censorship Resistance Study Group. As a network newbie whose only experience in TCP and networking in general is 3 hours of reading [TCP/IP Ilustrated](https://www.isi.edu/~hussain/TEACH/Spring2014/notes/Steven00a.pdf), I was excited by topics like Domain Fronting, Tor Relays, Quic, etc. However, I often struggled to visualize the implementation details of these strategies and got confused by _which pieces fit where_. To better understand these issues, I resolved to learn Go (a language well-suited for networking) and gain some hands-on experience in coding network-related programs.

I was introduced to [Protohackers](https://protohackers.com/) by reading the blog of a study-group mate. Protohackers is a series of coding challenges that ramp up one’s understanding of networking protocols.

Yesterday, I started to tackle the first challenge: [Smoke Test](https://protohackers.com/problem/0). This test instructs you to write a TCP server that echos back whatever is being sent to it by a client. Although this is the 0-indexed warm-up problem of the series, I felt a bit lost when tackling this problem due to the following:

1.  I have spent a total of a few hours with Go, the programing language.
2.  I am unaware of what level of abstraction the series expected.
3.  The series wanted you to host your server on the cloud, so it can test it.
4.  I do not know how I can test this server before putting it online.

Luckily, I intuited that the problem itself is simple enough, so the “premeditation” of the algorithm is simple enough to leave mental space for juggling with syntax and unfamiliar library APIs. I tallied the resources I have for tackling this problem.

1.  I know that TCP is one step lower than HTTP. So I should probably not look at Go’s HTTP libraries.
2.  I know buffers and I/Os will be used.
3.  The internet will provide code samples for me to warm up to the syntax.

The first step I took is to look for code samples. Admittedly, this is a bit of a cop-out just like using library APIs instead of implementing my own TCP-related methods. Since my main goal is to learn Go, I thought these concessions expedient.

So I went ahead thinking about what I will need to do in the code:

1.  Create a server object (very javascript-brained of me) by calling something like \`.listen(PORT)\`
2.  Create a buffer in a forloop that reads from input, keep it in a data structure.
3.  Write that data structure back to the client as a response

The first step I took is looking at existing code samples from [Coderwall](https://coderwall.com/p/wohavg/creating-a-simple-tcp-server-in-go):

```
package main

import (
 "fmt"
 "io"
 "os"

 "log"

 "net"
)

func main() {
 arguments := os.Args
 if len(arguments) == 1 {
  fmt.Println("Please provide a port number!")
  return
 }

 PORT := ":" + arguments\[1\]
 l, err := net.Listen("tcp4", PORT)
 if err != nil {
  log.Fatal(err)
 }
 defer l.Close()

 for {
  c, err := l.Accept()
  if err != nil {
   fmt.Println(err)
   return
  }
  go handleConnection(c)
 }
}

func handleConnection(c net.Conn) {
 fmt.Printf("Serving %s\\n", c.RemoteAddr().String())
 packet := make(\[\]byte, 4096)
 tmp := make(\[\]byte, 4096)
 defer c.Close()
 for {
  \_, err := c.Read(tmp)
  if err != nil {
   if err != io.EOF {
    fmt.Println("read error:", err)
   }
   println("END OF FILE")
   break
  }
  packet = append(packet, tmp...)
 }
 num, \_ := c.Write(packet)
 fmt.Printf("Wrote back %d bytes, the payload is %s\\n", num, string(packet))

}
```

A few things I gleaned from this code:

1.  \`net.listen()\` allows you to pass in connection type (TCP), IP and port. It returns a [Listener](https://pkg.go.dev/net#pkg-functions). Or our server.
2.  Our listener can call an `Accept`method to establishconnection, which, like in other languages, allows us to read and write.
3.  The connection’s `Read` and `Write`methods takes in the container buffer (slice of bytes), and returns the number of bytes read.

And some good Go syntax I’ve learned:

1.  The `go` keyword starts an async process.
2.  `defer`allows one to move around a context-ending operation, so it is easier to spot for the eye.

Note that this code handles payload in chunks of 1024 bytes. Protohacker’s requirement for this assignment is slightly different:

_‘Once the client has finished sending data to you it shuts down its sending side. Once you’ve reached end-of-file on your receiving side, and sent back all the data you’ve received, close the socket so that the client knows you’ve finished.’_

So my mental model for this assignment is like so:

1.  Take a `packet`variable that stores all the buffers
2.  Send packet back in one setting.

And here is my code. In it, my handler waits until the read is finished and sends everything back in one setting:

```
package main

import (
 "fmt"
 "io"
 "os"
 "log"
 "net"
)

func main() {
 arguments := os.Args
 if len(arguments) == 1 {
  fmt.Println("Please provide a port number!")
  return
 }

 PORT := ":" + arguments\[1\]
 l, err := net.Listen("tcp4", PORT)
 if err != nil {
  log.Fatal(err)
 }
 defer l.Close()

 for {
  c, err := l.Accept()
  if err != nil {
   fmt.Println(err)
   return
  }
  go handleConnection(c)
 }
}

func handleConnection(c net.Conn) {
 fmt.Printf("Serving %s\\n", c.RemoteAddr().String())
 packet := make(\[\]byte, 4096)
 tmp := make(\[\]byte, 4096)
 defer c.Close()
 for {
  \_, err := c.Read(tmp)
  if err != nil {
   if err != io.EOF {
    fmt.Println("read error:", err)
   }
   break
  }
  packet = append(packet, tmp...)
 }
  c.Write(packet)
}
```

The only difference is I intend to send the packet in one go after the read reaches EOF. Does it make a difference? I don’t know. I don’t even know how EOF is defined in scenarios like this. But it is good to ‘rewrite’ code when you are just learning a language.

Now, how do I test this code? I decided to write a local client:

```
package main

import (
 "io"
 "net"
 "os"
)

const (
 HOST = "localhost"
 PORT = "3333"
 TYPE = "tcp"
)

func main() {
 tcpServer, err := net.ResolveTCPAddr(TYPE, HOST+":"+PORT)
 if err != nil {
  println("ResolveTCPAddr failed:", err.Error())
  os.Exit(1)
 }

 conn, err := net.DialTCP(TYPE, nil, tcpServer)
 if err != nil {
  println("Dial failed:", err.Error())
  os.Exit(1)
 }

 defer conn.Close()

 \_, err = conn.Write(\[\]byte("Ground Control To Major Tom"))
 if err != nil {
  println("Write data failed:", err.Error())
  os.Exit(1)
 }

 // buffer to get data
 received := make(\[\]byte, 4096)
 for {
  println("Reading data...")
  temp := make(\[\]byte, 4096)
  \_, err = conn.Read(temp)
  if err != nil {
   if err == io.EOF {
    break
   }
   println("Read data failed:", err.Error())
   os.Exit(1)
  }
  received = append(received, temp...)
 }

 println("Received message:", string(received))

}
```

After I wrote the client I became aware of the existence of [netcat](https://netcat.sourceforge.net/) which could do what this code does in one line.

```
echo -n “Ground Control For Major Tom” | nc localhost 3333
```

But it was good getting the opportunity to learn about the client side API such as `dial` and `ResolveTCPAddr.`

After I ran the client, I was thrilled to know that the client and server acknowledged each other. (The left is the client, showing it has entered the read loop. And right side is the server, acknowledging it’s connected to my client).

However, it seems like both my server and my client are stuck in their respective read loops. My server never reaches the line that prints “Wrote back \_ bytes, the payload is \_”. And my client side never reaches “Received message: \_”.

I control-c-ed my client, and my server finished executing:

Yay! Now I am sure that the problem is not “server can’t read”, but “server can’t reach c.Write() to send back the payload, due to being stuck at read loop”. I go back to look at the problem code:

```
for {
  \_, err := c.Read(tmp)
  if err != nil {
   if err != io.EOF {
    fmt.Println("read error:", err)
   }
   println("END OF FILE")
   break
  }
  packet = append(packet, tmp...)
 }
```

It is highly likely that the server has not received the “EOF” signal from the client. And my ctrl-c-ing the client, ergo, cutting off the connection, achieved the “EOF” effect.

So now I found the central question: “How does my client tell the server it’s done?” Two possibilities abound:

1.  Cutting off connection by doing `conn.Close()`
2.  A special trick, like an identifier in the payload or a method.

I went about testing the first hypothesis. I am heavily skeptical that this is the solution because terminating connection to signal end of I/O sounds horrible. If this is the only way to do so, then maybe TCP has a big problem! Luckily, intellisense proved useful when I tried to add `conn.Close()`after my client’s message by reminding me that there is a method called `conn.CloseWrite()`. The name is expressive enough that I knew immediately that this is the solution. So I added one line containing `conn.CloseWrite()` to my client code:

```
package main

import (
 "io"
 "net"
 "os"
)

const (
 HOST = "localhost"
 PORT = "3333"
 TYPE = "tcp"
)

func main() {
 tcpServer, err := net.ResolveTCPAddr(TYPE, HOST+":"+PORT)
 if err != nil {
  println("ResolveTCPAddr failed:", err.Error())
  os.Exit(1)
 }

 conn, err := net.DialTCP(TYPE, nil, tcpServer)
 if err != nil {
  println("Dial failed:", err.Error())
  os.Exit(1)
 }

 defer conn.Close()

 \_, err = conn.Write(\[\]byte("Ground Control To Major Tom"))
 if err != nil {
  println("Write data failed:", err.Error())
  os.Exit(1)
 }

 //new line of code
 conn.CloseWrite()

 received := make(\[\]byte, 4096)
 for {
  println("Reading data...")
  temp := make(\[\]byte, 4096)
  \_, err = conn.Read(temp)
  if err != nil {
   if err == io.EOF {
    break
   }
   println("Read data failed:", err.Error())
   os.Exit(1)
  }
  received = append(received, temp...)
 }

 println("Received message:", string(received))

}

```

And voila, my server got the message from the client, and the client received its own message back:

What a great day, learning a lot about Go and putting something together that originally seemed out of my depth!

The next step is to take my server online. And I am ready for the challenge!
