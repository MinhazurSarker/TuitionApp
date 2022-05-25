import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../pages/_app";
import PostCard from "./PostCard";

function HomePostSection({ start }) {
    const {  token } = useContext(AppContext);

    const [postData, setPostData] = useState([]);

    useEffect(() => {
        fetchData()
        return () => { };
    }, [start]);

    async function fetchData() {
        await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/?page&div&dis&upo&uni&search`)).json().then(data => {
            setPostData(data.data);

        })
    }
    console.clear()

    return (
        <>
            <div className="flex justify-between items-end gap-4 mb-6">
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">Recent Posts</h2>
                <Link href="/posts">
                    <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">All Posts</a>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 lg:gap-4">
                {postData.map((item, i) => (
                    <PostCard
                        key={i}
                        cls={item.class}
                        days={item.days}
                        desc={item.desc}
                        divission={item.divission}
                        district={item.district}
                        upozilla={item.upozilla}
                        union={item.union}
                        liked={item.liked}
                        lang={item.lang}
                        subjects={item.subjects}
                        _id={item._id}
                        fees={item.salary}
                        token={token}
                    />
                ))}

            </div>
        </>
    );
}

export default HomePostSection;