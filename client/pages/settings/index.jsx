import Link from "next/link";
import { useContext, useEffect, useState, } from 'react';
import { AppContext } from './../_app';
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import { parseCookies } from "nookies";
import Cookies from "js-cookie";
import head from "next/head";






function Settings({ user, token }) {

    const ApiServer = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter();
    const { setToken, setUser } = useContext(AppContext)
    const [userData, setUserData] = useState(null);



    useEffect(() => {
        if (!token || token == null) {
            router.push('/login')
        } else {
            if (user) {
                setUserData(user.user)
            } else {
                router.push('/login')
            }
        }
        return () => {
        };
    }, []);


    //---------delet post handler
    const deleteUser = (e) => {
        e.preventDefault();
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
                axios.delete(`${ApiServer}/user/${userData._id}`, {
                    headers: {
                        'token': token,
                    }
                })
                    .then(res => {
                        setUser(null);
                        setToken(null);
                        localStorage.removeItem("user");
                        Cookies.remove('authToken', { path: '/' })
                        router.push('/login')
                    })
                    .then(res => {
                        Swal.fire({
                            title: 'Success',
                            text: "Your account has been deleted",
                            icon: 'success',
                            confirmButtonColor: '#6366f1',
                            confirmButtonText: 'Ok'
                        })
                    }).catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            text: error,
                        })
                    })
            }
        })
    }
    const coppyRef = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(`${window.location.origin}/login?ref=${userData._id}`);
        Swal.fire({
            title: 'Link copied',
            text: 'Referral link has been copied',
        })
    }
    // console.clear();

    return (
        <>

            <div className="flex flex-row ">
                <head>
                    <title>TuitionApp - Settings</title>
                </head>
                <div className="w-full h-full">
                    <div className="max-w-screen-xl px-4 md:px-8 mx-auto">

                        <div className="max-w-screen-2xl px-4 mb-8 md:px-8 mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                                <div>
                                    <h2 className="text-indigo-500 text-xl md:text-2xl text-center md:text-left font-bold">Create Post</h2>
                                    <p className="text-gray-600 dark:text-gray-200">Create post and ask for a tutor</p>
                                </div>
                                <Link passHref href="/posts/new">
                                    <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Go</a>
                                </Link>
                            </div>
                        </div>
                        <div className="max-w-screen-2xl px-4 mb-8 md:px-8 mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                                <div>
                                    <h2 className="text-indigo-500 text-xl md:text-2xl text-center md:text-left font-bold">Edit Profile</h2>
                                    <p className="text-gray-600 dark:text-gray-200">Edit your profile information</p>
                                </div>
                                <Link passHref href="/settings/profile/edit">
                                    <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Go</a>
                                </Link>
                            </div>
                        </div>
                        <div className="max-w-screen-2xl px-4 mb-8 md:px-8 mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                                <div>
                                    <h2 className="text-indigo-500 text-xl md:text-2xl font-bold">Upgrade Account</h2>
                                    <p className="text-gray-600 dark:text-gray-200">Become a tutor or upgrade subscription</p>
                                </div>
                                <Link passHref href="/settings/profile/upgrade">
                                    <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Go</a>
                                </Link>
                            </div>
                        </div>
                        <div className="max-w-screen-2xl px-4 mb-8 md:px-8 mx-auto">
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                                <div>
                                    <h2 className="text-indigo-500 text-xl md:text-2xl font-bold">Notifications</h2>
                                    <p className="text-gray-600 dark:text-gray-200">Check out all the notifications</p>
                                </div>
                                <Link passHref href="/notifications">
                                    <a className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Go</a>
                                </Link>
                            </div>
                        </div>
                        <div className="flex basis-1 md:basis-2">
                            <div className="w-full px-4 mb-8 md:px-8 mx-auto">
                                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                                    <div>
                                        <h2 className="text-indigo-500 text-xl md:text-2xl font-bold">Delete Account</h2>
                                        <p className="text-gray-600 dark:text-gray-200">All of your details and subscriptions will be deleted. You would not get any refund</p>
                                    </div>
                                    <button onClick={event => deleteUser(event)} >
                                        <p className="inline-block bg-red-500 hover:bg-red-600 active:bg-red-700 focus-visible:ring ring-red-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Delete</p>
                                    </button>
                                </div>
                            </div>
                            <div className="w-full px-4 mb-8 md:px-8 mx-auto">
                                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                                    <div>
                                        <h2 className="text-indigo-500 text-xl md:text-2xl font-bold">Refer to a friend and get points</h2>
                                        <p className="text-gray-600 dark:text-gray-200">You can use those points to upgrade your account.Click copy to copy your referral link.</p>
                                    </div>

                                    <button onClick={event => coppyRef(event)} className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Copy</button>

                                </div>
                            </div>
                        </div>

                    </div>
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
                user: user,
                token: token
            },
        };
    } else {
        return {
            props: {
                user: null,
                token: null
            },
        };
    }
}
export default Settings;