import Link from "next/link";
import { useEffect, useState } from "react";
import SidebarBookCard from "./SidebarBookCard";

function Sidebar() {
    const [bookData, setBookData] = useState([]);

    useEffect(() => {
        fetchData()
        return () => { };
    }, []);

    async function fetchData() {
        await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books?page&&search`)).json().then(res => {
            setBookData(res.data);
        })
    }
    return (
        <div className="w-full mx-auto px-4 md:px-8">
            <div className=" w-full p-1 my-1 pr-6">
                <div className="flex w-full flex-wrap justify-between items-start">
                    <div className="flex flex-col items-start flex-1">
                        <div>
                            <p className=" text-gray-800 dark:text-gray-200 text-md  font-bold transition duration-100 mb-1">Latest Books</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end flex-1">
                        <div>
                            <Link href="/books">
                                <p className=" cursor-pointer text-indigo-500 text-md  font-bold transition duration-100 mb-1">All Books</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {bookData.reverse().slice(0,4).map((item, i) => (
                <SidebarBookCard key={i} data={item} />
            ))}


        </div>
    );
}


export default Sidebar;