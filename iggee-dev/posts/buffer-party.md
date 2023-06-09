---
id: "buffer-party"
title: "Malaised Buffers Having A Party - Protohackers Q0"
date: "2023-06-05"
keywords: "Protohackers"
---

# Malaised Buffers Having A Party (Protohackers Q0)

So I have finished my simple echo TCP server for the first challenge of protohackers. It was not too hard. However, even my limited experience tells me that bringing things online is another beast. Oftentimes when I need to use a web service, there always seems to be an element of luck when I succeed. "I was not sure if the documentation actually mean this, but turns out my understanding was correct." This feeling often turns up for me during the self-taught process. I think xsthat's the peril and beauty of approaching things in a challenge-based way. Knowledge does not come in a linear fashion, but eventually clicks.
At first, I naively thought my IP address could be the outfacing address for my server, until the tests failed repeatedly. I intuited that this IP address does not have the public-facing capacity. After I asked Ben, he reminded me of ISP and router-level NAT(network address translation), which obscures my true IP address, so to speak. I was introduced to the concept but somehow it did not store in my brain's RAM. 
Sounds like it's baby devops time (me frantically reading the docs of a cloud service, trying to string together the meaning of such VPS' own jargons).
I thought I would use fly.io this time. I went through the boilerplate tutorial and brought my IP online by first installing flyctl, and simply running flyctl launch.
And the monitoring showed me 'Please provide a port!', which means somewhere along the way fly.io has 'go run .'ed my program as a default, yet my program requires the server-spawning user to provide a port as a command-line argument. I did some research on how to do this, and found what I thought was fly's equivalent of docker's "CMD", aka 'release command'. I tried adding the release command under ```[deploy]``` of the ```fly.toml``` file. But it did not work. I decided to shelf this issue and changed my program to simply declare a specific port. (Must reread things about docker image and such).
After I modified the program to simply call a hard-coded port. The connection still failed. My intuition is that probably the autogenerated fly.toml covered a boilerplate case that does not fit my own. For example, most people probably needed an http connection. After configuring a TCP service, the connection worked:
```
[[services]]
  protocol = "tcp"
  internal_port = 10000

  [[services.ports]]
    port = 10000
    ```
However, the protohackers test showed that echoing content has failed. I ran my local client against the server, and it seems to send back the correct content:
(Looking back, I should have spotted the problem here). I printed the message in the program and redeployed. And the issue is laid bare by fly.io's monitoring (perhaps a little rudely):
Empty buffer party! The buffers are unfulfilled and now cry out with existential question marks. Perhaps I have taken a bit of an abundance mindset when it comes to assigning buffers, see code below:
```
func handleConnection(conn net.Conn) {
 fmt.Printf("Serving %s\n", conn.RemoteAddr().String())
 packet := make([]byte, 4096)
 tmp := make([]byte, 4096)
 defer conn.Close()
 for {
  _, err := conn.Read(tmp)
  if err != nil {
   if err != io.EOF {
    fmt.Println("read error:", err)
   }
   println("END OF FILE")
   break
  }
  packet = append(packet, tmp...)
 }
 num, _ := conn.Write(packet)
 fmt.Printf("Wrote back %d bytes, the payload is %s\n", num, string(packet))

}
```
I primly scaled back, and assigned byte slices with the size of one:
```
//Packet is the final deliverable to be appended to, tmp is container
packet := make([]byte, 1)
tmp := make([]byte, 1)
```
And now only one troubled buffer remains:
And this is because I initialized packet with 1 byte which will always exist even when there is nothing to append.
I made packet empty:
and now we are properly warmed up for the rest of the protohackers challenge: