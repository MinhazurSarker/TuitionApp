import Sidebar from '../../components/Sidebar'

//-------icons
import { BiBookReader, BiHeart, BiShareAlt, BiPhoneCall, BiMessage, BiEdit, } from 'react-icons/bi';
import { MdOutlineLocationOn, MdReportProblem } from 'react-icons/md';
import { SiGoogleclassroom } from 'react-icons/si';
import { BiDirections } from 'react-icons/bi';
import { BsGenderAmbiguous, BsCalendarEvent, BsCalendarWeek } from 'react-icons/bs';
//--------libraries

import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineCurrencyBangladeshi } from 'react-icons/hi';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import head from 'next/head'

function Post({ postData, token }) {

    const router = useRouter();

    const [userCover, setUserCover] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userPhone, setUserPhone] = useState(null);
    const [name, setName] = useState('');
    const [userGender, setUserGender] = useState('');

    const [postId, setPostId] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const [postClass, setPostClass] = useState('');
    const [postSubjects, setPostSubjects] = useState('');
    const [postDays, setPostDays] = useState('');
    const [postlikes, setPostlikes] = useState('');
    const [postSalary, setPostSalary] = useState('');
    const [postLan, setPostLan] = useState('');
    const [postLon, setPostLon] = useState('');
    const [postLang, setPostLang] = useState('');

    const [divission, setDivission] = useState('');
    const [district, setDistrict] = useState('');
    const [upozilla, setUpozilla] = useState('');
    const [union, setUnion] = useState('');


    const [lan, setLan] = useState(null);
    const [lon, setLon] = useState(null);


    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setLan(position.coords.latitude);
                setLon(position.coords.longitude);
            });
        }


    }, []);
    const coneToInbox = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/inbox/`, { chatWith: userId }, {
            headers: {
                token: token
            }
        }).then(async (res) => {
            router.push(`/inbox/${res.data.chatId}`)
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: "Something went wrong..! ",
            })
        })
    }

    const like = async (e) => {
        e.preventDefault();
        if (token) {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/posts/like/${postId}`, { likedId: postId }, {
                headers: {
                    token: token
                }
            }).then(async (res) => {
                if (router.pathname == '/followings/posts') {
                    router.push(`/followings/posts?page=1&search`)
                } else { }
                Swal.fire({
                    icon: 'success',
                    title: res.data.type,
                    text: res.data.msg,
                    timer: 1500
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
    const getDirection = (e) => {
        if (lan && lon) {
            if (postLan && postLon) {
                window.open(`https://www.google.com/maps/dir/?api=1&origin=${lan},${lon}&destination=${postLan},${postLon}&z=15`, '_blank')
            } else {
                Swal.fire({
                    title: 'Oops',
                    text: "This post has no google map location or you are not a tutor",
                    icon: 'error',
                    confirmButtonColor: '#6366f1',
                    confirmButtonText: 'Ok'
                })
            }
        } else {
            Swal.fire({
                title: 'Oops',
                text: "Please allow the location access from your browser",
                icon: 'error',
                confirmButtonColor: '#6366f1',
                confirmButtonText: 'Ok'
            })
        }
    }

    useEffect(() => {
        if (postData == null) {
            router.push('/404')
        } else {
            console.log(postData)
            setUserCover(postData.author.coverImg);
            setUserAvatar(postData.author.avatarImg);
            setName(postData.author.name);
            setUserGender(postData.author.gender);
            setUserId(postData.author._id);
            setUserPhone(postData.author.phone);

            setPostId(postData._id);
            setPostDesc(postData.desc);
            setPostClass(postData.class);
            setPostSubjects(postData.subjects);
            setPostDays(postData.days);
            setPostlikes(postData.likes);
            setPostSalary(postData.salary);
            setPostLan(postData.lan);
            setPostLon(postData.lon);
            setPostLang(postData.lang);

            setDivission(postData.divission);
            setDistrict(postData.district);
            setUpozilla(postData.upozilla);
            setUnion(postData.union);
        }
        return () => { };
    }, []);

    const share = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href);
        Swal.fire({
            title: 'Link copied',
            text: 'User profile link has been copied',
        })
    }
    const phoneCall = (e) => {
        e.preventDefault();
        if (userPhone) {
            window.open(`tel:+8801610091869`, '_system');
        } else {
            Swal.fire({
                title: 'Only for Tutors',
                text: "You need to upgrade to pro member (tutor)",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#6366f1',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Upgrade'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/settings/profile/upgrade')
                }
            })
        }
    }

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
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - {postDesc}</title>
            </head>
            <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className=" w-11/12 px-8 py-4 mx-auto  bg-white dark:bg-slate-800 shadow-lg rounded-lg grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1">
                        <div>
                            <img className='flex justify-center w-full h-60 relative mt-2 border-4 bg-slate-900 rounded-lg border-indigo-500 object-cover' src={coverImg} alt='Cover image' />

                            <div className="flex justify-center -mt-20 ">
                                <div className='relative bg-slate-900 z-10 w-40 h-40 overflow-hidden border-4 rounded-full border-indigo-500'>
                                    <img src={profileImg} alt='Profile image' />
                                </div>
                            </div>
                            <div className="flex justify-center items-center ">
                                <p className="mt-4 m-6 text-xl font-semibold text-gray-800 dark:text-gray-200 md:text-2xl">{name}</p>

                            </div>

                        </div>
                        <div className='mt-2 px-8'>

                            <div className=' bg-slate-200 dark:bg-slate-700 rounded-lg  p-2 items-center'>

                                <div className="grid grid-cols-2 gap-2 w-full mt-4 items-center mb-3 ">
                                    <button onClick={e => like(e)} className=" mx-4 h-10 md:h-12 flex justify-center items-center  bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                        <BiHeart className='w-6 h-6' /><p className='mx-3'>Favorite</p>
                                    </button>
                                    <button onClick={e => share(e)} className=" mx-4 h-10 md:h-12 flex justify-center items-center  bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                        <BiShareAlt className='w-6 h-6' /><p className='mx-3'>Share</p>
                                    </button>
                                </div>
                                <div className="flex w-full  items-start mt-4 mb-3 ">
                                    <button onClick={event => phoneCall(event)} className=" w-full mx-4 h-10 md:h-12 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                        <BiPhoneCall className='w-6 h-6' /><p className='mx-5'>Call</p>
                                    </button>

                                </div>
                                <div className="flex w-full  items-start mt-4 mb-3 ">
                                    <button onClick={e => coneToInbox(e)} className="w-full min-w-max mx-4 h-10 md:h-12 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                        <BiMessage className='w-6 h-6' /><p className='mx-5'>Chat</p>
                                    </button>
                                </div>
                                <div className="flex w-full  items-start mt-4 mb-3 ">
                                    <button onClick={e => getDirection(e)} className="w-full min-w-max mx-4 h-10 md:h-12 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                        <BiDirections className='w-6 h-6' /><p className='mx-5'>Direction</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-screen-xl px-4 mt-6 md:px-8 mx-auto">

                    <div className=" w-11/12 px-8 py-4 mx-auto mt-4 bg-white dark:bg-slate-800 shadow-lg rounded-lg">

                        <p className="mt-2 m-6 text-lg font-semibold text-gray-800 dark:text-gray-200 md:mt-0 md:text-xl">{postDesc}</p>
                        <div className="grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8 m-6 mb-10">

                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <SiGoogleclassroom className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Class</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{postClass}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <BsCalendarWeek className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Days/Week</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{postDays}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <BiBookReader className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Tution Subjects</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{postSubjects}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <MdOutlineLocationOn className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Location</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{union + ', ' + upozilla + ', ' + district + ', ' + divission}</p>
                                </div>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200 group flex gap-4">
                                <div className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-indigo-500 group-hover:bg-indigo-600 group-active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                    <HiOutlineCurrencyBangladeshi className='w-6 h-6' />
                                </div>
                                <div>
                                    <div className="font-semibold mb-1">Salary</div>
                                    <p className="text-sm text-gray-800 dark:text-gray-400">{postSalary}</p>
                                </div>
                            </div>
                            <div className=" flex gap-4">
                                <Link href={`/posts/report/${postId}`} passHref>
                                    <a className="w-10 md:w-12 h-10 md:h-12 flex justify-center items-center shrink-0 bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white rounded-lg shadow-lg transition duration-100">
                                        <MdReportProblem className='w-6 h-6' />
                                    </a>
                                </Link>
                            </div>
                        </div>
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
    const token = parseCookies(ctx).authToken || null

    const res = await fetch(`${process.env.API_URL}/posts/${ctx.query.postId}`, {
        headers: {
            token: token
        }
    })
    const post = await res.json()
    if (post._id) {
        return {
            props: {
                postData: post,
                token: token
            },
        };
    } else {
        return {
            props: {
                postData: null,
                token: token
            },
        };
    }
}
export default Post;