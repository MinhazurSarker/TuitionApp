import head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import BookSidebar from "../../components/BookSidebar";

function Book({ data }) {
    const router = useRouter();

    const [content, setContent] = useState();
    const [img, setImg] = useState();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [bookData, setBookData] = useState(null);
    const [userData, setUserData] = useState(null);
    useEffect(() => {
        console.log(data.book)
        if (data.book == null) {
            router.push('/404')
        } else {
            setName(data.book.title)
            setImg(data.book.img)
            setId(data.book._id)
            setContent(data.book.desc)
            setBookData(data.book)
            setUserData(data.user)
        }
    }, []);
    let cover;
    if (!img || img === "") {
        cover = `/cover.svg`
    } else {
        cover = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`
    }
    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - {name}</title>
            </head>
            <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className="text-gray-800 dark:text-gray-200">
                        <div className="bg-gray-100 overflow-hidden rounded-lg shadow-lg relative mb-6 md:mb-8">
                            <img src={cover} loading="lazy" alt="Photo by Minh Pham" className="w-full h-full object-cover object-center" />
                        </div>
                        <div  className="max-w-screen-md px-4 md:px-8 mx-auto">
                            <p className="text-2xl font-semibold mb-4" >{name}</p>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: content }} className="max-w-screen-md px-4 md:px-8 mx-auto">
                        </div>
                    </div>
                </div>
            </div>
            <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                <BookSidebar data={bookData} user={userData} />
            </div>


        </div>

    );
}

export async function getServerSideProps(ctx) {
    const token = parseCookies(ctx).authToken || null

    const res = await fetch(`${process.env.API_URL}/book/${ctx.query.bookId}`)
    const book = await res.json()

    return {
        props: {
            data: book,
            token: token
        },
    };

}

export default Book;