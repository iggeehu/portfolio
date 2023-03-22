import { useState } from "react";


export default function Navbar(){

    const [showMenu, toggleShow] = useState(false);
    const showDropdown = () => {
        return(
            <div className="navbar-menu relative z-50">
            <nav className="bg-silver-tree-300 fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
                <div className="flex items-center mb-8">
                    <button className="navbar-close" onClick={()=>{toggleShow(false)}}>
                        <svg className="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div>
                    <ul>
                        <li className="mb-1">
                            <a className="block p-4 text-sm font-cyber text-silver-tree-900 hover:text-silver-tree-500 rounded" href="#">Home</a>
                        </li>
                        <li className="mb-1">
                            <a className="block p-4 text-sm font-cyber text-silver-tree-900 hover:text-silver-tree-500 rounded" href="#">MinViaCodes</a>
                        </li>
                        <li className="mb-1">
                            <a className="block p-4 text-sm font-cyber text-silver-tree-900 hover:text-silver-tree-500 rounded" href="#">Notes</a>
                        </li>
                        <li className="mb-1">
                            <a className="block p-4 text-sm font-cyber text-silver-tree-900 hover:text-silver-tree-500 rounded" href="#">Science Fiction &</a>
                        </li>
                        <li className="mb-1">
                            <a className="block p-4 text-sm font-cyber text-silver-tree-900 hover:text-silver-tree-500 rounded" href="#">Contact</a>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto">
                    <div className="pt-6">
                        {/* <a className="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold leading-none bg-gray-50 hover:bg-gray-100 rounded-xl" href="#">Sign in</a>
                        <a className="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700  rounded-xl" href="#">Sign Up</a> */}
                    </div>
                    <p className="my-4 text-xs text-center text-gray-400">
                        <span>Copyright © 2021</span>
                    </p>
                </div>
            </nav>
        </div>
        )
    }

    return (
        <div className='navBar bg-silver-tree-200'>
           
            <nav className="relative px-4 py-4 flex justify-between items-center">
            <a className="text-3xl font-bold font-cyber from-silver-tree-200 via-silver-tree-500 to-silver-tree-900 bg-clip-text" href="#">
                {/* <svg className="h-10" alt="logo" viewBox="0 0 10240 10240"> */}
                Tianci Hu Marrero
                {/* </svg> */}
            </a>
            <div className="lg:hidden">
                <button className="navbar-burger flex items-center text-blue-600 p-3" onClick={()=>{console.log("hi"); toggleShow(!showMenu)}}>
                    <svg className="block h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <title>Mobile menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                    </svg>
                </button>
            </div>
            <ul className="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:flex lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6">
                <li><a className="text-m font-cyber text-silver-tree-900 hover:text-silver-tree-500 transition ease-in-out delay-150" href="#">Home</a></li>
                <li><a className="text-m font-cyber text-silver-tree-900 hover:text-silver-tree-500 transition ease-in-out delay-150" href="#">MinViaCodes</a></li>
                <li><a className="text-m font-cyber text-silver-tree-900 hover:text-silver-tree-500 transition ease-in-out delay-150" href="#">Notes</a></li>
                <li><a className="text-m font-cyber text-silver-tree-900 hover:text-silver-tree-500 transition ease-in-out delay-150" href="#">Science Fiction &</a></li>
                <li><a className="text-m font-cyber text-silver-tree-900 hover:text-silver-tree-500 transition ease-in-out delay-150" href="#">Contact</a></li>
            </ul>
        </nav>
        {showMenu ? showDropdown() : null}

        
    </div>
    )
}