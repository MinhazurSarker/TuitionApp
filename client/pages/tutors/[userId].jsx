//---------components

import Sidebar from '../../components/Sidebar'
import Review from '../../components/Review'
import WriteReview from '../../components/WriteReview';
//-------icons
import { BiBookReader, BiHeart, BiShareAlt, BiPhoneCall, BiMessage } from 'react-icons/bi';
import { MdOutlineLocationOn } from 'react-icons/md';
import { SiGoogleclassroom } from 'react-icons/si';
import { BsGenderAmbiguous, BsCalendarEvent } from 'react-icons/bs';
//--------libraries
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import head from 'next/head';
function Tutor({ userData, token }) {


    const router = useRouter();

    const [education, setEducation] = useState([])
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [userPhone, setUserPhone] = useState(null);
    const [userBio, setUserBio] = useState('');
    const [userClass, setUserClass] = useState('');
    const [userSubjects, setUserSubjects] = useState('');
    const [userInstitute, setUserInstitute] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userAge, setUserAge] = useState('');
    const [userGender, setUserGender] = useState('');
    const [userCover, setUserCover] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [userRate, setUserRate] = useState([]);

    const [divission, setDivission] = useState('');
    const [district, setDistrict] = useState('');
    const [upozilla, setUpozilla] = useState('');
    const [union, setUnion] = useState('');


    //-----------auth-check



    useEffect(() => {
        if (userData == null) {
            router.push('/404')
        } else {
            setUserId(userData._id);
            setUserPhone(userData.phone);
            setUserName(userData.name);
            setUserBio(userData.bio);
            setUserClass(userData.class);
            setUserSubjects(userData.subjects);
            setUserAge(userData.age);
            setUserInstitute(userData.institute);
            setUserDepartment(userData.department);
            setUserGender(userData.gender);
            setUserCover(userData.coverImg);
            setUserAvatar(userData.avatarImg);
            setDivission(userData.divission);
            setDistrict(userData.district);
            setUpozilla(userData.upozilla);
            setUnion(userData.union);
            setEducation(userData.education);
            setUserRate(userData.ratings);
        }

        return () => {

        };
    }, []);

    const updateRatings = async () => {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/${userId}`,
        ).then(async (res) => {
            setUserRate(res.data.ratings)
        })
    }

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

    const follow = async (e) => {
        e.preventDefault();
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/follow/`, { followId: userId }, {
            headers: {
                token: token
            }
        }).then(async (res) => {
            Swal.fire({
                icon: 'success',
                title: res.data.type,
                text: res.data.msg,
            })
        }).catch((res) => {
            Swal.fire({
                icon: 'error',
                title: 'Not allowed',
                text: "You can not follow or unfollow this user",
            })
        })
    }
    const phoneCall = (e) => {
        e.preventDefault();
        if (userPhone) {
            window.open(`tel:+${userPhone}`, '_system');
        } else {
            Swal.fire({
                title: 'Only for Tutors',
                text: "You need to upgrade to pro member (Become a tutor)",
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
    const share = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href);
        Swal.fire({
            title: 'Link copied',
            text: 'User profile link has been copied',
        })
    }

    //---------delet post handler
    const totalRatings = userRate.length || 1
    const getSumByKey = (arr, key) => {
        return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
    }
    var stars = getSumByKey(userRate, 'stars')
    var rating = Number(stars) / Number(totalRatings) || 0;

    let profileImg;
    if (!userAvatar || userAvatar === "") {
        if (userGender == 'male') {
            profileImg = `/boy.svg`
        } else if(userGender=="female") {
            profileImg = `/girl.svg`
        }else{
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
        <>{
            userData ?

                <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
                    <head>
                        <title>TuitionApp - Hi, I am {userName} from {userDepartment} department of {userInstitute}</title>
                    </head>
                    < div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2" >
                        <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                            <div className=" w-11/12 px-8 py-4 mx-auto  bg-white dark:bg-slate-800 shadow-lg rounded-lg grid 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 grid-cols-1">
                                <div>
                                    <img className='flex justify-center w-full h-60 relative mt-2 border-4 bg-slate-900 rounded-lg border-indigo-500 object-cover' src={coverImg} alt='Cover image' />

                                    <div className="flex justify-center -mt-20 ">
                                        <div className='relative bg-slate-900 z-10 w-40 h-40 overflow-hidden border-4 rounded-full border-indigo-500'>
                                            <img src={profileImg} alt='Profile image' />
                                        </div>
                                    </div>
                                    <div className="flex justify-center ">
                                        <p className="mt-4 mx-6 my-3 text-xl font-semibold text-gray-800 dark:text-gray-200 md:text-2xl">{userName}</p>
                                    </div>
                                    <div className="">
                                        <p className="mt-2 mx-6 text-lg font-semibold text-gray-800 dark:text-gray-200 md:mt-0 ">{userDepartment} ,{userInstitute}</p>
                                        <p className="mt-2 m-6 text-md text-gray-800 dark:text-gray-200 md:mt-0 ">{userBio}</p>
                                    </div>
                                </div>
                                <div className='mt-2 px-8'>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <BiBookReader className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Tuition Subjects</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userSubjects}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <SiGoogleclassroom className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Preferable Classes</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userClass}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <MdOutlineLocationOn className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Preferable Area</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{union + ', ' + upozilla + ', ' + district + ', ' + divission}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <BsCalendarEvent className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Age</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userAge}</p>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-start mb-3 mx-4">
                                        <span className="inline-block p-2 text-indigo-500 bg-indigo-100 rounded-xl md:mx-4 dark:text-white dark:bg-indigo-500">
                                            <BsGenderAmbiguous className={`w-5 h-5 `} />
                                        </span>

                                        <div className=" md:mx-4 w-full md:mt-0">
                                            <p className="text-lg text-gray-700  dark:text-gray-200">Gender</p>
                                            <p className="text-sm text-gray-700  dark:text-gray-200">{userGender == 'male' ? 'Male' : userGender == 'female' ? 'Female' : userGender == 'custom' ? 'Custom' : ''}</p>
                                        </div>
                                    </div>
                                    <div className=' bg-slate-200 dark:bg-slate-700 rounded-lg  p-2 items-center'>
                                        <div className=" w-full mt-4 items-center mb-3 ">
                                            <div className="flex mx-4 top-0 justify-between px-4 py-2 rounded-lg bg-white dark:bg-indigo-500/10 ">
                                                <
                                                    // @ts-ignore
                                                    StarRatings
                                                    rating={rating}
                                                    starRatedColor="#FACC32"
                                                    starDimension='18px'
                                                    starSpacing='1px'
                                                    numberOfStars={5}
                                                    name='rating'
                                                />
                                                <p className='text-gray-800 dark:text-gray-200'>{Number((rating).toFixed(1))}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 w-full mt-4 items-center mb-3 ">
                                            <button onClick={(event) => { follow(event) }} className=" mx-4 h-10 md:h-12 flex justify-center items-center  bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                <BiHeart className='w-6 h-6' /><p className='mx-3'>Follow</p>
                                            </button>
                                            <button onClick={(event) => { share(event) }} className=" mx-4 h-10 md:h-12 flex justify-center items-center  bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                <BiShareAlt className='w-6 h-6' /><p className='mx-3'>Share</p>
                                            </button>
                                        </div>
                                        <div className="flex w-full  items-start mt-4 mb-3 ">
                                            <button onClick={(event) => { phoneCall(event) }} className=" w-full mx-4 h-10 md:h-12 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                <BiPhoneCall className='w-6 h-6' /><p className='mx-5'>Call</p>
                                            </button>
                                        </div>
                                        <div className="flex w-full  items-start mt-4 mb-3 ">
                                            <button onClick={event => coneToInbox(event)} className="w-full min-w-max mx-4 h-10 md:h-12 flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-lg shadow-lg transition duration-100">
                                                <BiMessage className='w-6 h-6' /><p className='mx-5'>Chat</p>
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                            {education.map((degree, index) => (
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
                            <div className="  w-11/12 p-8 mx-auto  bg-white dark:bg-slate-800 shadow-lg rounded-lg">
                                <div className=''>
                                    <div>
                                        <WriteReview userId={userId} token={token} updateRatings={updateRatings} />
                                    </div>
                                </div>
                                <div className="">
                                    <p className="mt-2 my-6 text-lg font-semibold text-gray-800 dark:text-gray-200 md:mt-0 ">Recent Reviews:</p>
                                </div>
                                <div className=''>
                                    <div>
                                        {userRate.map((rate, i) => (
                                            <Review key={i} rate={rate} />
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                    <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                        <Sidebar />
                    </div>
                </div >
                : ''
        }</>

    );
}
export async function getServerSideProps(ctx) {
    const token = parseCookies(ctx).authToken || null

    const res = await fetch(`${process.env.API_URL}/user/${ctx.query.userId}`, {
        headers: {
            token: token
        }
    })
    const user = await res.json()
    if (user._id) {
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
                token: token
            },
        };
    }
}
export default Tutor;