import Link from "next/link";
import { useEffect, useState } from "react";

function SidebarBookCard({ data }) {
    const [img, setImg] = useState();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    useEffect(() => {
        setName(data.title)
        setImg(data.img)
        setId(data._id)
        return () => {
        };
    }, [data]);
    let cover;
    if (!img || img === "") {
        cover = `/cover.svg`
    } else {
        cover = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
    }
    return (
        <Link href={`/books/${id}`}>
            <div className=" w-full p-1 my-1 pr-6 bg-white dark:bg-slate-800 transition-all duration-150 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">
                <div className="flex w-full flex-wrap justify-between items-start">
                    <div className="">
                        <a className="group w-14 h-14 block bg-gray-100 rounded-lg overflow-hidden relative">
                            <img src={cover} loading="lazy" alt="Photo by Jessica Radanavong" className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-200" />
                        </a>
                    </div>
                    <div className="flex flex-col items-end flex-1">
                        <div>
                            <p className="inline-block text-gray-800 dark:text-gray-200 text-md  font-bold transition duration-100 mb-1">{name}</p>

                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}



export default SidebarBookCard;