import Link from 'next/link';
import Sidebar from '../../components/Sidebar'
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { AiOutlineLeft, AiOutlineRight, AiOutlineUndo } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import BookCard from '../../components/BookCard';
import head from 'next/head';
function Books({ booksArray }) {

    const router = useRouter();

    const [start, setStart] = useState(false);
    const [postData, setPostData] = useState([]);

    const [search, setSearch] = useState('');
    const [pages, setPages] = useState(1);
    const [current, setCurrent] = useState(1);
    ;



    const HandleSearch = (e) => {
        e.preventDefault();
        router.push(`/books/?page=${current}&search=${search}`)
    }
    const clearSearch = (e) => {
        setSearch('')
        router.push(`/books/?page=${current}&search=${''}`)
    }
    const prevPage = (e) => {
        if (current > 1) {
            setCurrent(current - 1)
            router.push(`/books/?page=${current - 1}&search=${''}`)
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Not available',
                text: 'This is the first page.',
                timer: 1500
            })
        }
    }
    const nextPage = (e) => {
        if (current < pages) {
            setCurrent(current + 1)
            router.push(`/books/?page=${current + 1}&search=${''}`)
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Not available',
                text: 'This is the last page.',
                timer: 1500
            })
        }
    }


    useEffect(() => {
            if (booksArray) {
                setPostData(booksArray.data);
                setPages(booksArray.pages);
                setCurrent(booksArray.current);
                setStart(!start)
            }
        return () => {
        };
    }, [booksArray]);

    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Books</title>
            </head>
            <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className="flex justify-between items-center gap-4 mb-6">
                        <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">Books</h2>
                    </div>
                    <div className={`flex w-full justify-between items-center gap-4 mb-6 h-full`} >
                        <div className="w-full flex bg-white rounded-lg shadow-lg dark:bg-slate-800 p-4">
                            <input value={search} onChange={e => setSearch(e.target.value)} className=" bg-gray-200 dark:bg-slate-900 text-gray-700 dark:text-gray-200 items-center h-10 w-full px-3 text-sm" type="text" placeholder="Search…" />
                            <button onClick={(event) => { clearSearch(event) }} className="w-10 focus:border-0 md:w-12 h-10 flex justify-center items-center shrink-0 bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white shadow-lg transition duration-100">
                                <AiOutlineUndo className='w-6 h-6' />
                            </button>
                            <button onClick={(event) => { HandleSearch(event) }} className="w-10 focus:border-0 md:w-12 h-10 flex justify-center items-center shrink-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-r-lg shadow-lg transition duration-100">
                                <BiSearch className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
                        {postData.map((item, i) => (
                            <BookCard key={i} data={item} />
                        ))}
                    </div>
                    <div className="flex mt-6 justify-center items-center gap-4">
                        <button onClick={e => prevPage(e)} className={` px-3 h-10 flex justify-center items-center shrink-0 ${current == 1 ? 'bg-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'}  text-white rounded-lg shadow-lg transition duration-100`}>
                            <AiOutlineLeft className='w-6 h-6' /> Prev
                        </button>
                        <div className="px-3 h-10 flex justify-center items-center shrink-0 bg-indigo-500 text-white rounded-lg shadow-lg transition duration-100">
                            {current + '/' + pages}
                        </div>
                        <button onClick={e => nextPage(e)} className={` px-3 h-10 flex justify-center items-center shrink-0 ${current == pages ? 'bg-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'} text-white rounded-lg shadow-lg transition duration-100`}>
                            Next <AiOutlineRight className='w-6 h-6' />
                        </button>
                    </div>
                </div>

            </div>
            <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                <Sidebar />
            </div>
        </div>

    );
}
export async function getServerSideProps(ctx) {
   

    const res = await fetch(`${process.env.API_URL}/books/?page=${ctx.query.page || 1}&search=${ctx.query.search || ''}`)
    const books = await res.json()
    return {
        props: {
            booksArray: books,
        },
    };
}

export default Books;