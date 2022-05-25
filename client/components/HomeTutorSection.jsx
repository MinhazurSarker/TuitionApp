
import Link from 'next/link';
import {  useEffect, useState } from 'react';

import TutorCard from './TutorCard'
function HomeTutorSection({ token }) {
    const ApiServer = process.env.NEXT_PUBLIC_API_URL
    const ServerRoot = process.env.NEXT_PUBLIC_ROOT_URL

    const [tutorData, setTutorData] = useState([]);

    useEffect(() => {
        fetchData()
        return () => { };
    }, []);

    async function fetchData() {
        await (await fetch(`${ApiServer}/tutors/?page&div&dis&upo&uni&search`)).json().then(data => {
            setTutorData(data.data);
        })
    }
    console.clear()
    return (
        <>
            <div className="flex justify-between items-end gap-4 mb-6">
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">Recent Registered Tutors</h2>
                <Link href="/tutors">
                    <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">All Tutors</a>
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                {tutorData.map((item, i) => (
                    <TutorCard
                        key={i}
                        avatarImg={item.avatarImg}
                        name={item.name}
                        
                        institute={item.institute}
                        department={item.department}
                        gender={item.gender}
                        id={item._id}
                        token={token}
                    />
                ))}

            </div>
        </>
    );
}


export default HomeTutorSection;