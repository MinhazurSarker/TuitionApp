import head from 'next/head'
import { useEffect, useState } from "react";

function Terms({ data }) {
    const [content, setContent] = useState(null);
    useEffect(() => {

        setContent(data.html)
        console.log(data.html)
        return () => {
        };
    }, []);
    return (

        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Terms and conditions</title>
            </head>
            <div className="w-full px-12 md:px-8 mx-auto  lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <div className="container px-12 py-16 mx-auto">
                        <div className="mb-8 md:mb-12">
                            <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">Terms and Conditions</h2>
                            <p dangerouslySetInnerHTML={{ __html: content }} className=" text-gray-900 bg-white dark:bg-slate-800 dark:text-gray-200 w-full"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {

    const res = await fetch(`${process.env.API_URL}/terms`)
    const data = await res.json()
    return {
        props: {
            data: data
        }
    }
}

export default Terms;