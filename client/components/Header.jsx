import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { BiBell } from 'react-icons/bi'


function header({ updateMobileMenuState, mobileMenuShow, darkmode }) {
    const handleClick = () => {
        updateMobileMenuState(!mobileMenuShow)

    }
    return (
        <div className="bg-white dark:bg-slate-800 lg:mb-6 md:mb-4 sm:mb-2 mb-2 backdrop-blur-lg supports-backdrop-blur:bg-white/95 dark:bg-slate-800/90 sticky top-0 z-50">
            <div className="w-full px-2 md:px-8 mx-auto shadow-md">
                <header className="flex  items-center py-1 md:py-2 ">
                    <button onClick={handleClick} type="button" className=" md:invisible lg:invisible xl:invisible 2xl:invisible inline-flex items-center bg-white dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 dark:hover:text-slate-200 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <Link href="/">
                        <a className="inline-flex items-center mx-auto text-black-800 text-2xl md:text-3xl font-bold gap-2.5" aria-label="logo">
                            <Image src={`${darkmode ? '/tutionAppWhite.svg' : '/tutionApp.svg'}`} height={35} width={150} />
                        </a>
                    </Link>
                    <Link href='/notifications' passHref>
                        <a type="button" className=" inline-flex items-center bg-white dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 dark:hover:text-slate-200 focus-visible:ring ring-indigo-300 text-gray-500 active:text-gray-700 text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
                            <BiBell className="h-6 w-6" />
                        </a>
                    </Link>
                </header>
            </div>
        </div>
    );
}



export default header;