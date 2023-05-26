import React, { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './navbar'
import Script from 'next/script'

type Props = {
  children?: ReactNode
  title?: string
}

//   bg-gradient-to-r
//   from-silver-tree-50
//   via-silver-tree-300
//   to-silver-tree-500
//   background-animate

const Layout = ({ children, title = 'Tianci Hu Marrero' }: Props) => (
  <div className="w-full
  h-full bg-white
  ">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&family=Kanit&family=Rajdhani:wght@500&display=swap" rel="stylesheet" /> 
    </Head>
    <header>
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