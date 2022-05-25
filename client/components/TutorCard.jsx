
import StarRatings from 'react-star-ratings';
import { BiHeart } from 'react-icons/bi'
import Link from 'next/link';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';

function TutorCard({ avatarImg, name, institute, department, id, gender, token }) {


    const router = useRouter();

    const ApiServer = process.env.NEXT_PUBLIC_API_URL
    const ServerRoot = process.env.NEXT_PUBLIC_BACKEND_URL

    const [userRate, setUserRate] = useState([]);
    const [userFollowers, setUserFollowers] = useState(0);


    //-----------count ratings
    const totalRatings = userRate.length || 1
    const getSumByKey = (arr, key) => {
        return arr.reduce((accumulator, current) => accumulator + Number(current[key]), 0)
    }
    var stars = getSumByKey(userRate, 'stars') || 0;
    var rating = Number(stars) / Number(totalRatings) || 0;


    let profileImg;
    if (!avatarImg || avatarImg === "") {
        if (gender == 'male') {
            profileImg = `/boy.svg`
        } else if(gender=="female") {
            profileImg = `/girl.svg`
        }else{
            profileImg = `/boy.svg`
        }
    } else {
        profileImg = `${ServerRoot}/${avatarImg}`
    }
    const follow = async (e) => {
        e.preventDefault();
        if (token) {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/follow/`, { followId: id }, {
                headers: {
                    token: token
                }
            }).then(async (res) => {
                data()
                Swal.fire({
                    icon: 'success',
                    title: res.data.type,
                    text: res.data.msg,
                    timer:1500
                })
                if (router.pathname=='/followings') {
                    router.push(`/followings?page=1&search`)
                    
                }else{}
            }).catch((res) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Not allowed',
                    text: 'You can not follow / unfollow this user',
                })
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Login please',
            })
        }
    }
    async function data() {
        await (await fetch(`${ApiServer}/user/${id}`)).json().then(data => {
            setUserRate(data.ratings)
            setUserFollowers(data.followers)
        })
    }
    useEffect(() => {
        console.clear()
        data()
        return () => { };
    }, []);

    return (

        <div className="flex relative flex-col items-center bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8  cursor-pointer">
            <div className='flex z-10 absolute top-3 right-3 items-center '>
                <p className="text-indigo-500 text-sm font-bold text-center mr-2">{userFollowers}</p>
                <button onClick={event => follow(event)} className={`  flex items-center px-2 py-2 text-white transition-colors duration-200 transform rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-indigo-500`} >
                    <BiHeart className={`w-5 h-5`} />
                </button>
            </div>
            <Link href={`/tutors/${id}`}>
                <div className="w-full mt-3 h-auto aspect-square relative  bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-lg mb-2 md:mb-4">
                    <img src={profileImg} loading="lazy" alt="" className="aspect-square w-full h-full object-cover object-center" />
                </div>
            </Link>
            <Link href={`/tutors/${id}`}>
                <div className=''>
                    <p className="text-indigo-500 md:text-lg font-bold text-center">{name}</p>
                    <p className="text-gray-600 dark:text-gray-200 text-sm mt-1 ">{department || '...'}</p>
                    <p className="text-gray-600 dark:text-gray-200 text-sm   mb-2">{institute || '...'}</p>

                    <div className="flex justify-center">
                        <div className="flex gap-4">
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
                        </div>
                    </div>

                </div>
            </Link>
        </div>
    );
}

export default TutorCard;