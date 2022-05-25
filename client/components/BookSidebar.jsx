import Link from "next/link";
import { useEffect, useState } from "react";

function BookSidebar({ data, user }) {
    const [img, setImg] = useState();
    const [name, setName] = useState();
    const [PDF, setPDF] = useState();





    useEffect(() => {
        console.log(user)
        if (user) {
            setImg(user.avatarImg)
            setName(user.name)
        }
        if (data) {
            setPDF(data.pdf)
        }
        return () => { };
    }, [data, user]);
    let profileImg;
    if (!img || img === "") {
        profileImg = `/boy.svg`
    } else {
        profileImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
    }

    return (
        <div className="w-full mx-auto">
            <div className='w-full mb-8 px-4 md:px-8 mx-auto'>

                <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-lg p-4 lg:p-8">
                    <div className="w-24 md:w-32 h-24 md:h-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-lg mb-2 md:mb-4">
                        <img src={profileImg} loading="lazy" alt="Photo by Elizeu Dias" className="w-full h-full object-cover object-center" />
                    </div>

                    <div>
                        <div className="text-indigo-500 md:text-lg font-bold text-center">{name}</div>
                        <hr className="my-4"/>
                        <div className="flex justify-center">
                            {(PDF !== "") ?
                                <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${PDF}`}>
                                    <a target='_blank' className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-2">Download PDF</a>
                                </Link> : ''
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookSidebar;