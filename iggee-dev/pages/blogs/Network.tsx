import { useState } from "react"


export default function Network (){

    const [showCensorshipTerms, setCensorshipTerms] = useState(false)
    const CensorshipTermsCollapsed = () => {
        if(showCensorshipTerms){
        return(
            <p className="text-lg font-cyber">

                1. TCP/IP socket connection
                <br />
                2. DNS blocking: forcing ISP to redirect users.<br />
                Possible reaction: Override default DNS.<br />
                <br />
                3. IP blocking: as the name suggests.<br />
                Possible reaction: use VPN or proxy.<br />
                <br />
                4. Port blocking: stop traffic from accessing standard ports.<br />
                Possible reaction: different ports or more sophisticated VPN.<br />
                <br />
                5.DPI blocking: packet-level filtering which identifies origins of traffic.<br />
        
                6.Deep packet inspection: DPI does not &quot; decrypt &quot; what&apos;s inside packets but identifies the protocol of the source apps.
                <br />
                7.OSI reference model: short for Open Systems Interconnection Model. This is something I encountered in the TCP/IP book.
                It has 7 layers, each layer deals with one level of abstraction in networking - application, presentation, session, transport
                network, data link, physical. And According to my understanding, each layer is agnostic about the other and has its own headers, etc.
                Snowflake is a new WebRTC Pluggable Transport on the Tor browser. A snowflake client contains a client transport plugin which provides an interface between client
                app and the transport. The interface is a localhost socks server. The Tor browser will set this server as its proxy setting. The snowflake client is also 
                responsible for ensuring connections to remote snowflake proxies are available. (These proxies are run by volunteers?) the local snowflake client and remote 
                peer must first establish connectivity using WebRTC before the Snowflake client can use the transport.
                <br />
                8.Rendezvous strategy: a layer that makes WebRTC possible that must be implemented by the user. A Rendezvous enables a program to actively send outgoing signal for 
                connection rather than passively listen.<br />
                <br />
                9.Domain fronting.
                <br />
                10. NAT traversal and ICE negotiation.<br />
                11. WebRTC; NAT:network address translation;  SCTP and DTLS; fingerprinting
                </p>
        )}
    }
    return (<div className="">
            <div className="p-3">
                <h2 className="text-lg font-blog hover:underline" onClick={()=>setCensorshipTerms(!showCensorshipTerms)}>1. A list of networking & censorship-circumvention terms</h2>
                <div>{CensorshipTermsCollapsed()}</div>
                

            </div>
        </div>)

}