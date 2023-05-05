import Head from 'next/head'
import Layout from './layout'
import { useState } from 'react'

export default function Home() {

  return (
    <div className='h-full'>
      <Head>
        <title>Tianci: Cooking</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      <main className="h-full">
        <Layout>
          <div className="text_shadows text-2xl text-center p-20">
            Eggy & Bison Bento Boxes  
          </div>
          <div className="text-xl text-center">
            During 2022, I was stuck at home waiting for my work permit & social security. I started making elaborate bento boxes for my husband, Bison.
          </div>
          <br></br>
          <div className="text-l text-center">
            First, I just made Chinese dishes that I am familiar with, like these:
          </div>

          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>

          <div className="flex p-3">
            <div className="basis-1/2">
            <img src="https://i.imgur.com/vMPF8mO.jpg" alt="eggtomato" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Egg & tomato (my childhood fave) and shrimp with corn</p>
            </div>
            
            <div className="basis-1/2">
            <img src="https://i.imgur.com/iywLQj3.jpg" alt="congee"  className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Chicken & century-egg congee, tiger-skin egg, pumpkin fried in preserved duck egg yoke</p>
            </div>
          </div>

          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>

          <div className="flex p-3"> 
            <div className="basis-1/2">
            <img src="https://i.imgur.com/HMeHLCs.png"  alt="sesameballs" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Fried rice and sesame balls</p>
            </div>

            <div className="basis-1/2">
            <img src="https://i.imgur.com/USO8c2H.png"  alt="ribs" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Sweet and sour ribs, and sticky rice cake and yam balls</p>
            </div>
          </div>

          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>

          <div className="flex p-3"> 
            <div className="basis-1/2">
            <img src="https://i.imgur.com/x5gHwWx.jpg"  alt="mushroom" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Egg & Mushroom, Stir-fried Cauliflower, and Three-Cup Chicken</p>
            </div>

            <div className="basis-1/2">
            <img src="https://i.imgur.com/208iO3T.jpg"  alt="liver" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Sichuan-style pig liver, scallion-fried Tofu, and spicy cabbage</p>
            </div>
          </div>

          <br></br>
          <div className="text-xl text-center">
            In the midst of the Chinese bento streak, Bison started complaining that the bento was plastic and he is ingesting microplastics. Lol.
          </div>
          <br></br>
          <div className="text-xl text-center">
            So I bought metal bento boxes. They are more aesthetic, but the portions are smaller.
          </div>
          <br></br>


          <div className="h-10">.</div>
          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
  
          <div className="text-2xl text-center">
            Entering Chinese Bento 2.0.1
          </div>
          

          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>

          <div className="w-3/5 m-auto">
            <img src="https://i.imgur.com/pGAw4Zl.png"  alt="medallions" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Fried sticky rice medallions and Fish-fragrant (yuxiang) porky pork</p>
          </div>

          <div className="w-3/5 m-auto">
            <img src="https://i.imgur.com/nCj4okW.png"  alt="heisanduo" className='m-auto h-95 p-2' title="source: imgur.com" />
            <p className='text-center'>Yunan Heisanduo (Three Chopped Ingredients) and cold buckwheat noodle</p>
            </div>
          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>

          <br></br>

          <div className="m-auto flex">

            <div className="basis-1/3">
            <img src="https://i.imgur.com/ejUXBp1.png"  alt="bison" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Bison meatball, Chaozhou style (beating it until it is bouncy)</p>
            </div>

            <div className="basis-1/3">
            <img src="https://i.imgur.com/tDNiml7.png"  alt="sandwich" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>Zucchini and Eggplant sandwich with beef stuffing</p>
            </div>

            <div className="basis-1/3">
            <img src="https://i.imgur.com/DjzxNSh.png"  alt="Dumplings" className='m-auto w-2/3 p-2' title="source: imgur.com" />
            <p className='text-center'>And finally, DUMPLINGS</p>
            </div>
          </div>

          <p className="m-auto">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <p className="text-center">.</p>
          <div>There are still about 30 bentos to show...but I will do it later!</div>
          
          
        </Layout>
      </main>
    </div>
  )
}
