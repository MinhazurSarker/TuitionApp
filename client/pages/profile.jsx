//---------components
import Sidebar from '../components/Sidebar'
//-------icons
import { BiBookReader, BiEdit, BiTrash } from 'react-icons/bi';
import { MdOutlineLocationOn } from 'react-icons/md';
import { SiGoogleclassroom } from 'react-icons/si';
import { BsGenderAmbiguous, BsCalendarEvent, BsCalendarWeek } from 'react-icons/bs';
//--------libraries
import { useRouter } from "next/router";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HiOutlineCurrencyBangladeshi } from 'react-icons/hi';
import Swal from 'sweetalert2';
import StarRatings from 'react-star-ratings';
import { parseCookies } from 'nookies';
import head from 'next/head';
function Profile({ userData, token }) {
    const ApiServer = process.env.NEXT_PUBLIC_API_URL
    const ServerRoot = process.env.NEXT_PUBLIC_BACKEND_URL
    const router = useRouter();

    // @ts-ignore


    const [userDataNew, setUserDataNew] = useState(null);
    const [userAvatar, setUserAvatar] = useState('');
    const [userCover, setUserCover] = useState('');
    const [userGender, setUserGender] = useState('');
    const [userRole, setUserRole] = useState('');

    const [posts, setPosts] = useState([]);
    const [degrees, setDegrees] = useState([]);
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        if (!token || token == null) {
            router.push('/login')
        } else {
            if (userData) {
                setUserDataNew(userData.user);
                setUserRole(userData.user.role);
                setUserAvatar(userData.user.avatarImg);
                setUserCover(userData.user.coverImg);
                setUserGender(userData.user.gender);
                setDegrees(userData.user.education)
                setPosts(userData.user.posts)
                setRatings(userData.user.ratings)
            }else{
                router.push('/login')
            }
        }
        return () => {
        };

    }, []);


    //-----------count ratings
    const totalRatings = ratings.length || 1
    const getSumByKey = (arr, key) => {
        return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
    }
    var stars = getSumByKey(ratings, 'stars') || 0
    //--------update posts after delete
    const update = async (id) => {
        try {
            await fetch(`${ApiServer}/my-profile`, {
                headers: {
                    'token': token,
                }
            }).then((res) => res.json())
                .then((data) => {
                    setPosts(data.user.posts)
                })
                .catch((err) => {
                })
        } catch (err) {
        }

    }
    //---------delet post handler
    const deletePost = (i) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will not be able to undo it",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6366f1',
            confirmButtonText: 'Delete'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${ApiServer}/posts/${i}`, {
                    headers: {
                        'token': token,
                    }
                }).then(res => {
                    update(i);
                    Swal.fire({
                        title: 'Success',
                        text: "Post has been deleted",
                        icon: 'success',
                        confirmButtonColor: '#6366f1',
                        confirmButtonText: 'Ok',
                        timer: 1500
                    })
                })
            }
        })
    }

    console.clear();
    let profileImg;
    if (!userAvatar || userAvatar === "") {
        if (userGender == 'male') {
            profileImg = `/boy.svg`
        } else if (userGender == "female") {
            profileImg = `/girl.svg`
        } else {
            profileImg = `/boy.svg`
        }
    } else {
        profileImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${userAvatar}`
    }
    let coverImg;
    if (!userCover || userCover === "") {
        coverImg = `/cover.svg`
    } else {
        coverImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${userCover}`
    }


    return (
        <>
            <head>
                <title>TuitionApp - My profile</title>
            </head>
            <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
                <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                    <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                        {userDataNew ?
                            <div className=" w-11/12 px-8 py-4 mx-auto  bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                                <div>
                                    <img className='flex justify-center w-full h-60 relative mt-2 border-4 bg-slate-900 border-white rounded-lg dark:border-indigo-500 object-cover' src={coverImg} alt='Cover image' />
                                    <div className="flex justify-center -mt-20 ">
                                        <div className='relative z-10 w-40 h-40 overflow-hidden border-4 bg-slate-900 border-white rounded-full dark:border-indigo-500'>
                                            <img src={profileImg} alt='Profile image' />
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center ">
                                        <p className="mt-4 m-5  text-xl font-semibold text-gray-800 dark:text-gray-200 md:text-2xl">{userDataNew.name}</p>
                                        <Link href='/settings/profile/edit' passHref>
                                            <a className="w-8 md:w-8 h-5 md:h-5 flex justify-center items-center shrink-0 text-slate-700 hover:text-slate-500 dark:text-slate-300 dark:hover:text-slate-100 transition duration-100">
                                                <BiEdit className='w-5 h-5' />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className=" w-full mt-2 items-center mb-3 ">
                                        <div className={`flex mx-4 top-0 justify-center px-4 py-4 rounded-lg   ${userRole == 'user' ? 'bg-slate-100 dark:bg-indigo-500/10' : userRole == 'tutor' ? 'bg-green-600' : userRole == 'super' ? 'bg-green-600' : userRole == 'admin' ? 'bg-green-600' : 'bg-slate-100 dark:bg-indigo-500/10'}`}>
                                            <p className='text-gray-800 font-semibold text-center text-xl dark:text-gray-200'>You are a {userRole == 'user' ? 'Student' : userRole == 'tutor' ? 'Tutor' : userRole == 'super' ? 'Super Admin' : userRole == 'admin' ? 'Admin' : 'User'}</p>
                                        </div>
                                    </div>
                                    <div className=" w-full mt-2 items-center mb-3 ">
                                        <div className="flex mx-4 top-0 justify-between px-4 py-2 rounded-lg bg-slate-100 dark:bg-indigo-500/10 ">
                                            <
                                                // @ts-ignore
                                                StarRatings
                                                rating={stars / totalRatings}
                                                starRatedColor="#FACC32"
                                                starDimension='18px'
                                                starSpacing='1px'
                                                numberOfStars={5}
                                                name='rating'
                                            />
                                            <p className='text-gray-800 dark:text-gray-200'>{Number((stars / totalRatings).toFixed(1))}</p>
                                        </div>
                                    </div>
                                    <div className="">
                                        <p className="mt-2 m-6 text-md font-semibold flex justify-center items-center text-gray-800 dark:text-gray-200 md:mt-0 ">{userDataNew.bio}</p>
                                    </div>
                                </div>
                                <div className='mt-2 px-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <BiBookReader className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Tuition Subjects</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userDataNew.subjects}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <SiGoogleclassroom className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Preferable Classes</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userDataNew.class}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <MdOutlineLocationOn className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Preferable Area</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userDataNew.union + ', ' + userDataNew.upozilla + ', ' + userDataNew.district + ', ' + userDataNew.divission}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <BsCalendarEvent className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Age</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userDataNew.age}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <BsGenderAmbiguous className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Gender</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userDataNew.gender}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : ''}
                    </div>
                    <div className="max-w-screen-xl px-4 mt-6 md:px-8 mx-auto">
                        <div className="  w-11/12 p-8 mx-auto  bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                            <div className="">
                                <p className="mt-2 my-6 text-lg font-semibold text-gray-800 dark:text-gray-200 md:mt-0 ">Educational Details:</p>
                            </div>
                            <div className='overflow-x-auto'>
                                <table className=" w-full border-collapse border-4 border-slate-200 text-gray-700 dark:text-gray-200 h-12 px-4 dark:border-slate-700">
                                    <thead>
                                        <tr>
                                            <th className="border-4 text-left border-slate-200 text-indigo-500 text-md lg:text-lg xl:text-xl 2xl:text-2xl  h-12 px-4 dark:border-slate-700">Exam</th>
                                            <th className="border-4 text-left border-slate-200 text-indigo-500 text-md lg:text-lg xl:text-xl 2xl:text-2xl  h-12 px-4 dark:border-slate-700">Sec/dep</th>
                                            <th className="border-4 text-left border-slate-200 text-indigo-500 text-md lg:text-lg xl:text-xl 2xl:text-2xl  h-12 px-4 dark:border-slate-700">Result</th>
                                            <th className="border-4 text-left border-slate-200 text-indigo-500 text-md lg:text-lg xl:text-xl 2xl:text-2xl  h-12 px-4 dark:border-slate-700">Year</th>
                                            <th className="border-4 text-left border-slate-200 text-indigo-500 text-md lg:text-lg xl:text-xl 2xl:text-2xl  h-12 px-4 dark:border-slate-700">Institutions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {degrees.map((degree, index) => (
                                            <tr key={index}>
                                                <td className="border-4 border-slate-200 text-gray-700 text-md lg:text-lg xl:text-xl 2xl:text-2xl dark:text-gray-200 h-12 px-4 dark:border-slate-700">{degree.exam}</td>
                                                <td className="border-4 border-slate-200 text-gray-700 text-md lg:text-lg xl:text-xl 2xl:text-2xl dark:text-gray-200 h-12 px-4 dark:border-slate-700">{degree.dep}</td>
                                                <td className="border-4 border-slate-200 text-gray-700 text-md lg:text-lg xl:text-xl 2xl:text-2xl dark:text-gray-200 h-12 px-4 dark:border-slate-700">{degree.result}</td>
                                                <td className="border-4 border-slate-200 text-gray-700 text-md lg:text-lg xl:text-xl 2xl:text-2xl dark:text-gray-200 h-12 px-4 dark:border-slate-700">{degree.year}</td>
                                                <td className="border-4 border-slate-200 text-gray-700 text-md lg:text-lg xl:text-xl 2xl:text-2xl dark:text-gray-200 h-12 px-4 dark:border-slate-700">{degree.institute}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-screen-xl px-4 mt-6 md:px-8 mx-auto">
                        <div className="  w-11/12 px-8 mx-auto">
                            <div className="flex justify-center items-center gap-4 ">
                                <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">My Posts</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-2 lg:gap-4">
                                {posts.map((post, index) => (
                                    <div key={index} className=" w-11/12 px-8 py-4 mx-auto mt-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                                        <p className="mt-2 m-6 text-lg font-semibold text-gray-800 dark:text-gray-200 md:mt-0 md:text-xl">{post.desc}</p>
                                        <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 m-6 mb-10">

                                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                    <SiGoogleclassroom className='w-6 h-6' />
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Class</div>
                                                    <p className="text-sm text-gray-800 dark:text-gray-400">{post.class}</p>
                                                </div>
                                            </div>
                                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                    <BsCalendarWeek className='w-6 h-6' />
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Days/Week</div>
                                                    <p className="text-sm text-gray-800 dark:text-gray-400">{post.days}</p>
                                                </div>
                                            </div>
                                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                    <BiBookReader className='w-6 h-6' />
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Tution Subjects</div>
                                                    <p className="text-sm text-gray-800 dark:text-gray-400">{post.subjects}</p>
                                                </div>
                                            </div>
                                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                    <MdOutlineLocationOn className='w-6 h-6' />
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Location</div>
                                                    <p className="text-sm text-gray-800 dark:text-gray-400">{post.union + ', ' + post.upozilla + ', ' + post.district + ', ' + post.divission}</p>
                                                </div>
                                            </div>
                                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                    <HiOutlineCurrencyBangladeshi className='w-6 h-6' />
                                                </div>
                                                <div>
                                                    <div className="font-semibold mb-1">Salary</div>
                                                    <p className="text-sm text-gray-800 dark:text-gray-400">{post.salary}</p>
                                                </div>
                                            </div>
                                            <div className=" flex gap-4">
                                                <Link href={`/posts/edit/${post._id}`} passHref>
                                                    <a className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white rounded-lg shadow-lg transition duration-100">
                                                        <BiEdit className='w-6 h-6' />
                                                    </a>
                                                </Link>

                                                <button onClick={() => deletePost(post._id)} className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg shadow-lg transition duration-100">
                                                    <BiTrash className='w-6 h-6' />
                                                </button>


                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
                <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                    <Sidebar />
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(ctx) {
    let token = parseCookies(ctx).authToken || null;
    if (token) {
        const res = await fetch(`${process.env.API_URL}/my-profile`, {
            headers: {
                token: token
            }
        })
        const user = await res.json()
        return {
            props: {
                userData: user,
                token: token
            },
        };
    } else {
        return {
            props: {
                userData: null,
                token: null
            },
        };
    }
}

export default Profile;


