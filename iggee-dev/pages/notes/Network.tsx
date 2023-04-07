const articleTitle1 = "Speed-running OS -Day 1: Basics"


export default function Network (){

    return (<div>
            <div className="new-cens-terms">
                <h1>A list of new networking & censorship terms</h1>
                <ol>
                    <li>
                        TCP/IP socket connection
                    </li>
                    <li>
                        DNS blocking: forcing ISP to redirect users.
                        Possible reaction: Override default DNS.
                    </li>
                    <li>
                        IP blocking: as the name suggests.
                        Possible reaction: use VPN or proxy.
                    </li>
                    <li>
                        Port blocking: stop traffic from accessing standard ports.
                        Possible reaction: different ports or more sophisticated VPN.
                    </li>
                    <li>
                        DPI blocking: packet-level filtering which identifies origins of traffic.
                    </li>
                    <li>
                        Deep packet inspection: DPI does not "decrypt" what's inside packets but identifies the protocol of the source apps.
                    </li>
                    <li>OSI reference model: short for Open Systems Interconnection Model. This is something I encountered in the TCP/IP book.
                        It has 7 layers, each layer deals with one level of abstraction in networking - application, presentation, session, transport
                        network, data link, physical. And According to my understanding, each layer is agnostic about the other and has its own headers, etc. </li>
                    <li>Snowflake is a new WebRTC Pluggable Transport on the Tor browser. A snowflake client contains a client transport plugin which provides an interface between client
                        app and the transport. The interface is a localhost socks server. The Tor browser will set this server as its proxy setting. The snowflake client is also 
                        responsible for ensuring connections to remote snowflake proxies are available. (These proxies are run by volunteers?) the local snowflake client and remote 
                        peer must first establish connectivity using WebRTC before the Snowflake client can use the transport.
                    </li>
                    <li>Rendezvous strategy: a layer that makes WebRTC possible that must be implemented by the user. A Rendezvous enables a program to actively send outgoing signal for 
                        connection rather than passively listen.
                    </li>
                    <li>Domain fronting:</li>
                    <li>NAT traversal and ICE negotiation:</li>
                    <li>WebRTC; NAT:network address translation;  SCTP and DTLS; fingerprinting </li>
                </ol>

            </div>
        </div>)

}