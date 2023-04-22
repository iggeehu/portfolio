
import { useState } from 'react'


export default function BookList() {



  return (
    <div className='h-full bg-silver-tree-200 rounded p-3'>
        <h3 className='bg-silver-tree-400'>BookList</h3>
        <a href="https://immigence.herokuapp.com/" className='bg-silver-tree-200'>https://immigence.herokuapp.com</a>
        <p className='text-s text-silver-tree-800'>You want a place to organize your reading library without all the noises
        or the fluff. Just compile your list and share them on social media or output as PDF.
        </p>
        <p>Written in React/Redux and Node/MongoDB.</p>
        <iframe className="inline" src="https://ghbtns.com/github-btn.html?user=iggeehu&repo=bookList&type=star&size=large&text=false" frameBorder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>

    </div>
  )
}
