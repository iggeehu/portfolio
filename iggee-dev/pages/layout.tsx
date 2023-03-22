import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './navbar'
import Script from 'next/script'

type Props = {
  children?: ReactNode
  title?: string
}



const Layout = ({ children, title = 'Tianci Hu Marrero' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <Script src='/Users/tiancihu/Documents/iggee.dev/iggee-dev/pages/scripts/hamburgermenu.js' strategy="afterInteractive" />
      <Navbar />
    </header>
    {children}
    <footer>
      <hr />
      <span>Thank you for visiting.</span>
    </footer>
  </div>
)

export default Layout