
import { useState } from 'react'


export default function BookList() {


  return (
    <div className='h-full bg-silver-tree-200 rounded p-3'>
        <h3 className='bg-silver-tree-400'>BookList</h3>
        <a href="https://immigence.herokuapp.com/" className='bg-silver-tree-200'>Deployed Demo Coming Soon</a>
        <p className='text-s text-silver-tree-800'>
          1. place to organize your reading library and browse other people's list. 
        </p>
        <p className='text-s text-silver-tree-800'>
          2. Share your lists on social media or output as PDF.
        </p>
        <p className='text-s text-silver-tree-800'>
          3. One-click add the cheapest copy of the book to your Abebooks cart.
        </p>
        <p>Written in React/Redux and Node/MongoDB.</p>
        <iframe className="inline" src="https://ghbtns.com/github-btn.html?user=iggeehu&repo=bookList&type=star&size=large&text=false" width="170" height="30" title="GitHub"></iframe>

    </div>
  )
}
