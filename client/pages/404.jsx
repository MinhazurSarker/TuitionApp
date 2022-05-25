// pages/404.jsx
import Link from "next/dist/client/link"
import head from 'next/head'
export default function Custom404() {
    const goBack = () => history.back()
    return (
        <>
            <div className="h-screen/80 py-6 sm:py-8 md:py-16 lg:py-24">
                <head>
                    <title>404 - Page not found</title>
                </head>
                <div className="max-w-screen-lg h-full my-auto  px-4 md:px-8 mx-auto">
                    <div className="grid h-full sm:grid-cols-2  gap-8">

                        <div className="flex flex-col justify-center items-center sm:items-start md:py-24 lg:py-32">
                            <p className="text-indigo-500 text-sm md:text-base font-semibold uppercase mb-4">Error 404</p>
                            <h1 className="text-gray-800 dark:text-gray-50 text-2xl md:text-3xl font-bold text-center sm:text-left mb-2">Page not found</h1>
                            <p className="text-gray-500 dark:text-gray-200 md:text-lg text-center sm:text-left mb-8">The page you’re looking for doesn’t exist.</p>
                            <div className="flex  gap-4">
                                <button onClick={goBack} className="inline-block bg-gray-200 text-slate-900 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-500 hover:bg-gray-300 focus-visible:ring ring-indigo-300 active:text-gray-700 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Go Back</button>
                                <Link href="/">
                                    <a className="inline-block bg-gray-200 text-slate-900 dark:text-slate-200 dark:bg-slate-700 dark:hover:bg-slate-500 hover:bg-gray-300 focus-visible:ring ring-indigo-300 active:text-gray-700 text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Go home</a>
                                </Link>
                            </div>
                        </div>
                        <div className="h-80 md:h-auto bg-gray-100 overflow-hidden shadow-lg rounded-lg relative">
                            <img src="https://images.unsplash.com/photo-1590642916589-592bca10dfbf?auto=format&q=75&fit=crop&w=600" loading="lazy" className="w-full h-full object-cover object-center absolute inset-0" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}