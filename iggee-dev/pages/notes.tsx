import Head from 'next/head'
import Layout from './layout'
import { useState } from 'react'
import RecurseCenter from './notes/RecurseCenter'
import OsNotes from './notes/OsNotes'
import Network from './notes/Network'
import Cloud from './notes/Cloud'


export default function Home() {
  const displayMap = {"Recurse":0,
  "Operating System":1, 
  "Network":2,
  "Cloud":3}

  const [displayDial, toggleDisplay] = useState(0)

  const showRecurseComponent = () => {
    if(displayDial==0){return <RecurseCenter />}
  }

  const showOSComponent = () => {
    if(displayDial==1){return <OsNotes />}
  }

  const showNetworkComponent = () => {
    if(displayDial==2){return <Network />}
  }

  const showCloudComponent = () => {
    if(displayDial==2){return <Cloud />}
  }


  return (
    <div className='h-full bg-silver-tree-100'>
      <Head>
        <title>Tianci: Notes</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className="h-screen">
        <Layout>
          <h2 className='font-blog'>Last Updated: Mar 26, 2023</h2>
          <div className="notes-body p-20 flex flex-row">
            <div className="notes-catalog basis-1/4 bg-silver-tree-300 h-96 rounded">
                <div className="font-blog text-2xl underline text-center">Threads of Thoughts</div>
                  <div className="blog-subcategory font-blog text-xl flex hover:bg-silver-tree-400 p-1 cursor-default"
                  onClick={()=>{toggleDisplay(0)}}
                  >
                  Recurse Center Progress Tracker
                  </div>
                  <div className="blog-subcategory font-blog text-xl flex hover:bg-silver-tree-400 p-1 cursor-default"
                  onClick={()=>{toggleDisplay(1)}}
                  >
                  Operating System Notes
                  </div>
                
                  <div className="blog-subcategory font-blog text-xl flex hover:bg-silver-tree-400 hover:underline p-1 cursor-default"
                  onClick={()=>toggleDisplay(2)}
                  >
                  Network Fundamentals
                  </div>

                  <div className="blog-subcategory font-blog text-xl flex hover:bg-silver-tree-400 p-1 cursor-default"
                  onClick={()=>toggleDisplay(3)}
                  >
                  Cloud Computing
                  </div>

                  <div className="blog-subcategory font-blog text-xl flex hover:bg-silver-tree-400 p-1 cursor-default"
                  onClick={()=>toggleDisplay(3)}
                  >
                  Literature - Reading List
                  </div>
                
            </div>
            <div className="notes-content basis-3/4 bg-silver-tree-400 rounded-xl">
              {showRecurseComponent()}
              {showOSComponent()}
              {showNetworkComponent()}
              {showCloudComponent()}
            </div>
          </div>
        </Layout>
      </main>
    </div>
  )
}