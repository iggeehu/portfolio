
import { useState } from 'react'


export default function Immigence() {

  const [showRecurse, setShowRecurse] = useState(false)  

  return (
    <div className='h-full bg-silver-tree-200 rounded p-3'>
        <h3 className='bg-silver-tree-400'>Immigence: Your USCIS Insights</h3>
        <a href="https://immigence.herokuapp.com/" className='bg-silver-tree-200'>https://immigence.herokuapp.com</a>
        <p className='text-s text-silver-tree-800'>You are a new immigrant waiting impatiently for your petition to be approved.
            With Immigence, you can submit your case information, and a web crawler will
            scan the 5000 cases in your case range daily, offering you insights such as 
            petition type distribution, approval status distribution, approval trends, etc.
        </p>
        <p>Written in Python flask. Libraries: Beautiful Soup, Bokeh, Redis, RQ. Database: MySQL on Amazon RDS</p>
        <iframe className="inline" src="https://ghbtns.com/github-btn.html?user=iggeehu&repo=Immigence&type=star&size=large&text=false" frameBorder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>

    </div>
  )
}
