import Link from "next/link";
import { useEffect, useState } from "react";

function BookCard({data}) {
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
            <div className=" min-w-full h-64 mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-slate-800 cursor-pointer">
                <img className="object-cover object-center w-full h-48" src={cover} alt="avatar" />
                <div className="px-6 py-4">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h1>
                </div>
            </div>
        </Link>
    );
}


export default BookCard;