
import { SiGoogleclassroom } from 'react-icons/si'
import { BsCalendarWeek } from 'react-icons/bs'
import { BiBookReader, BiGlobe, BiHeart } from 'react-icons/bi'
import { MdOutlineLocationOn, MdOpenInNew } from 'react-icons/md'
import { HiOutlineCurrencyBangladeshi } from 'react-icons/hi'
import Link from 'next/link'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

function PostCard({ days, desc, divission, district, upozilla, union, liked, lang, subjects, fees, _id, cls, token }) {
    const router = useRouter();
    const like = async (e) => {
        e.preventDefault();
        if (token) {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/like/${_id}`,{likedId:_id} ,{
                headers: {
                    token: token
                }
            }).then(async (res) => {
                if (router.pathname=='/followings/posts') {
                    router.push(`/followings/posts?page=1&search`)
                }else{}
                Swal.fire({
                    icon: 'success',
                    title: res.data.type,
                    text: res.data.msg,
                    timer:1500
                })
            }).catch((res) => {
               
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: res.data.msg,
                })
            })
        } else {
            router.push('/')
        }
    }

    return (
        <>

            <Link href={`/posts/${_id}`} passHref>
                <a >
                    <div className="relative w-11/12 p-2 mx-auto mt-2 bg-white dark:bg-slate-800 shadow-lg rounded-lg">

                        <p className="mt-2 m-6 text-lg font-semibold text-gray-800 dark:text-gray-200 md:mt-0 md:text-xl">{desc}</p>
                        <button onClick={event => like(event)} className={` absolute right-3 top-3 flex items-center px-2 py-2 text-white transition-colors duration-200 transform rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-indigo-500`} >
                            <BiHeart className={`w-5 h-5`} />
                        </button>
                        <div className="  grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 m-6 mb-10">
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-2">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <SiGoogleclassroom className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Class</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{cls}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-2">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <BsCalendarWeek className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Days/Week</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{days}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-2">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <BiBookReader className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Tution Subjects</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{subjects}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-2">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <MdOutlineLocationOn className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Location</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{union + ', ' + upozilla + ', ' + district + ', ' + divission}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-2">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <HiOutlineCurrencyBangladeshi className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Salary</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{fees}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-2">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <BiGlobe className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Language</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{lang}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </a>
            </Link>
        </>
    );
}

export default PostCard;