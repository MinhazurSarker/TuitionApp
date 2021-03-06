import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { FiFilter } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import { AiOutlineLeft, AiOutlineRight, AiOutlineUndo } from 'react-icons/ai';
import LocationSelector from '../../components/LocationSelector';
import Sidebar from '../../components/Sidebar'
import TutorCard from '../../components/TutorCard'
import Swal from 'sweetalert2';
import head from 'next/head';
function Tutors({ token, tutorsRes }) {

    const router = useRouter();

    const [start, setStart] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [tutorData, setTutorData] = useState([]);
    const [divission, setDivission] = useState('');
    const [district, setDistrict] = useState('');
    const [upozilla, setUpozilla] = useState('');
    const [union, setUnion] = useState('');
    const [search, setSearch] = useState('');
    const [pages, setPages] = useState(1);
    const [current, setCurrent] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    const handleLocationChanger = (div, dis, upo, uni) => {
        setDivission(div);
        setDistrict(dis);
        setUpozilla(upo);
        setUnion(uni)
    }
    const showForm = (e) => {
        e.preventDefault();
        setShowFilter(!showFilter);
    }
    const filter = (e) => {
        router.push(`/tutors/?page=${current}&div=${divission}&dis=${district}&upo=${upozilla}&uni=${union}&search=${search}`)
        setShowFilter(!showFilter);
    }
    const HandleSearch = (e) => {
        e.preventDefault();
        router.push(`/tutors/?page=${current}&div=${divission}&dis=${district}&upo=${upozilla}&uni=${union}&search=${search}`)
    }

    const clearFilter = async (e) => {
        e.preventDefault();
        setDivission('');
        setDistrict('');
        setUpozilla('');
        setUnion('')
        setSearch('')
        setShowFilter(!showFilter);
        router.push(`/tutors/?page=${''}&div=${''}&dis=${''}&upo=${''}&uni=${''}&search=${search}`)
    }
    const clearSearch = (e) => {
        setSearch('')
        router.push(`/tutors/?page=${current}&div=${divission}&dis=${district}&upo=${upozilla}&uni=${union}&search=${''}`)
    }
    const prevPage = (e) => {
        if (current > 1) {
            setCurrent(current - 1)
            router.push(`/tutors/?page=${current - 1}&div=${divission}&dis=${district}&upo=${upozilla}&uni=${union}&search=${''}`)
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
            router.push(`/tutors/?page=${current + 1}&div=${divission}&dis=${district}&upo=${upozilla}&uni=${union}&search=${''}`)
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
        setTutorData(tutorsRes.data);
        setPages(tutorsRes.pages);
        setCurrent(tutorsRes.current);
        setStart(!start)
    }, [tutorsRes]);

    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - All Tutors</title>
            </head>
            <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className="flex justify-between items-center gap-4 mb-6">
                        <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">All Tutors</h2>
                        <div className='flex gap-1 justify-end'>
                            <button onClick={e => showForm(e)} className={`w-10 h-10 flex justify-center items-center ${showFilter == true ? 'bg-red-500 hover:bg-red-600 active:bg-red-700' : 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'}  text-white rounded-lg shadow-lg transition duration-100`}>
                                {showFilter == true ?
                                    <MdClose className='w-6 h-6' />
                                    :
                                    <FiFilter className='w-5 h-5' />
                                }
                            </button>
                            <Link href="/tutors/my-area" passHref>
                                <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-2">In Your Area</a>
                            </Link>
                        </div>
                    </div>
                    <div className={`flex w-full justify-between items-center gap-4 mb-6 h-full`} >
                        <div className="w-full flex bg-white rounded-lg shadow-lg dark:bg-slate-800 p-4">
                            <input value={search} onChange={e => setSearch(e.target.value)} className=" bg-gray-200 dark:bg-slate-900 text-gray-700 dark:text-gray-200 items-center h-10 w-full px-3 text-sm" type="text" placeholder="Search???" />
                            <button onClick={(event) => { clearSearch(event) }} className="w-10 focus:border-0 md:w-12 h-10 flex justify-center items-center shrink-0 bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white shadow-lg transition duration-100">
                                <AiOutlineUndo className='w-6 h-6' />
                            </button>
                            <button onClick={(event) => { HandleSearch(event) }} className="w-10 focus:border-0 md:w-12 h-10 flex justify-center items-center shrink-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-r-lg shadow-lg transition duration-100">
                                <BiSearch className='w-6 h-6' />
                            </button>
                        </div>
                    </div>
                    <div className={`flex w-full justify-between items-center gap-4 mb-6 ${showFilter == false ? 'hidden' : 'block'}`} >
                        <div className="flex items-center justify-between  p-4 w-full flex-wrap mb-2 bg-white rounded-lg shadow-lg dark:bg-slate-800 ">
                            <LocationSelector change={handleLocationChanger} divission={divission} district={district} upozilla={upozilla} union={union} start={start} />
                            <div className=" flex gap-4">
                                <button onClick={e => clearFilter(e)} className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <AiOutlineUndo className='w-6 h-6' />
                                </button>
                                <button onClick={e => filter(e)} className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <FiFilter className='w-6 h-6' />
                                </button>
                            </div>
                        </div>
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
            <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                <Sidebar />
            </div>
        </div>

    );
}

export async function getServerSideProps(ctx) {
    let token = parseCookies(ctx).authToken || null;
    const res = await fetch(`${process.env.API_URL}/tutors/?page=${ctx.query.page || 1}&div=${ctx.query.div || ''}&dis=${ctx.query.dis || ''}&upo=${ctx.query.upo || ''}&uni=${ctx.query.uni || ''}&search=${ctx.query.search || ''}`)
    const tutors = await res.json()
    return {
        props: {
            tutorsRes: tutors,
            token: token

        },
    };
}

export default Tutors;