import Cookies from 'js-cookie';
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/router";
import { destroyCookie, setCookie } from 'nookies';

import { useContext, useEffect, useState } from 'react';
import { BiPlus, BiEnvelope, BiFile, BiGridAlt, BiHeart, BiChevronLeft, BiChevronRight, BiSun, BiMoon, BiCog, BiLogOut, BiGroup, BiLogIn } from "react-icons/bi";
import Swal from 'sweetalert2';
import { AppContext } from '../pages/_app';



function SideNav({ darkModeHandler, darkmode, mobileMenuShow, updateMobileMenuState, }) {
    // @ts-ignore
    const { user, token, setUser, setToken } = useContext(AppContext);
    const ServerRoot = process.env.NEXT_PUBLIC_BACKEND_URL

    const router = useRouter();
    const logout = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Logout'
        }).then((result) => {
            if (result.isConfirmed) {
                setUser(null);
                setToken(null);
                localStorage.removeItem("user");
                Cookies.remove('authToken', { path: '/' })
                Swal.fire({
                    title: 'Logged out!',
                    text: "You have been logged out.",
                    icon: 'success',
                    confirmButtonColor: '#6366f1',
                    confirmButtonText: 'Ok'
                })
                    .then((result) => {
                        if (result.isConfirmed) {
                            router.push('/login')
                        }
                    })
            }
        })

    }

    const [menuExpanded, setMenuExpanded] = useState(false);
    const menuExpandChange = () => {
        setMenuExpanded(!menuExpanded)
        localStorage.setItem('menuExpanded', `${menuExpanded === true ? '' : 'y'}`)
    }
    const handleThemeClick = () => {
        darkModeHandler(!darkmode)
        localStorage.setItem('theme', `${darkmode === true ? '' : 'dark'}`)
    }
    const handleMenuClick = () => {
        updateMobileMenuState(!mobileMenuShow)
    }

    useEffect(() => {
        if (localStorage.getItem('menuExpanded') === 'y') {
            setMenuExpanded(true)
        } else {
            setMenuExpanded(false)
        }
    }, []);
    useEffect(() => {
        const handleRouteChange = () => {
            updateMobileMenuState()
        }
        router.events.on('routeChangeStart', handleRouteChange)
    }, [])

    return (
        <>
            <div className='block sm:block md:hidden lg:hidden xl:hidden 2xl:hidden'>
                <button onClick={handleMenuClick} className={`${mobileMenuShow == true ? 'block sm:block' : 'hidden'} md:hidden lg:hidden xl:hidden 2xl:hidden    fixed h-screen w-screen top-0 backdrop-blur-lg supports-backdrop-blur:bg-white/95bg-slate-900/95 z-30`}>
                </button >
                <div className={`flex flex-col h-[85vh] z-40 ${mobileMenuShow == true ? '' : '-ml-56'} overflow-y-auto w-56 fixed transition-all duration-100 lg:mb-8 md:mb-6 sm:mb-4 mb-2 px-2 py-6 bg-white  dark:bg-slate-800  rounded-r-xl shadow-lg`}>

                    <Link passHref href="/">
                        <a className="inline-flex items-center mx-auto text-black-800 text-2xl md:text-3xl font-bold gap-2" aria-label="logo">
                            {darkmode == true ? <Image src='/tutionAppWhite.svg' height={30} width={130} /> : <Image src='/tutionApp.svg' height={30} width={130} />}
                        </a>
                    </Link>
                    <Link href='/posts/new' passHref>
                        <a type="button" className=" mt-6 inline-flex items-center bg-gray-900 transition-colors duration-200 hover:bg-gray-700 hover:text-white text-gray-200 active:text-white text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
                            <BiPlus className={`w-5 h-5`} />
                            New Post
                        </a>
                    </Link>
                    <div className="flex flex-col justify-between flex-1 mt-4">
                        <nav>
                            <Link passHref href="/inbox">
                                <a className={`flex items-center px-2 py-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/inbox' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiEnvelope className={`w-5 h-5 `} />
                                    <span className="mx-4 font-medium">Inbox</span>
                                </a>
                            </Link>
                            <Link passHref href="/posts">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == `/posts` || router.pathname == `/posts/my-area` || router.pathname == `/posts/[postId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiFile className={`w-5 h-5`} />
                                    <span className="mx-4 font-medium">Posts</span>
                                </a>
                            </Link>
                            <Link passHref href="/tutors">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == `/tutors` || router.pathname == `/tutors/my-area` || router.pathname == `/tutors/[userId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiGroup className={`w-5 h-5`} />
                                    <span className="mx-4 font-medium">Tutors</span>
                                </a>
                            </Link>
                            <Link passHref href="/followings">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == `/followings` || router.pathname == `/user/[userId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiHeart className={`w-5 h-5 `} />
                                    <span className="mx-4 font-medium">Followings</span>
                                </a>
                            </Link>
                            <Link passHref href="/books">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/book-store' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiGridAlt className={`w-5 h-5 `} />
                                    <span className="mx-4 font-medium">Books</span>
                                </a>
                            </Link>
                            <hr className="my-3 border-gray-200 dark:border-gray-600" />
                        </nav>
                        <nav>
                            <Link passHref href="/settings">
                                <a className={`flex items-center px-2 py-2 mt-2  text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/books' || router.pathname == `/books/[bookId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiCog className={`w-5 h-5 `} />
                                    <span className="mx-4 font-medium">Settings</span>
                                </a>
                            </Link>
                            <button onClick={handleThemeClick} className={`flex items-center px-2 py-2 mt-2 w-full  text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 `} >
                                {darkmode == true ?
                                    <>
                                        <BiSun className={`w-5 h-5 `} />
                                        <span className="mx-4 w-full font-medium">Light mode</span>
                                    </> : <>
                                        <BiMoon className={`w-5 h-5 `} />
                                        <span className="mx-4 w-full font-medium">Dark mode</span>
                                    </>
                                }
                            </button>
                        </nav>
                        {user && token && (user !== null || user !== undefined) && (token !== null || token !== undefined) ?

                            <div className={`flex items-center justify-between pr-1 mt-3  py-2 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 `}>
                                <Link passHref href="/profile">
                                    <img className="object-cover mx-2 rounded-md h-8 w-8 cursor-pointer" src={`${ServerRoot}${user.avatarImg}`} alt="" />
                                </Link>

                                <Link passHref href="/profile">
                                    <div>
                                        <p className="mx-2 font-medium text-gray-800  dark:text-gray-200 cursor-pointer">{user.name.split(' ')[0]}</p>
                                    </div>
                                </Link>
                                <button onClick={(event) => logout(event)} className=' float-right'>
                                    <BiLogOut className='rotate-180 w-5 h-5' />
                                </button>
                            </div> :

                            <Link passHref href="/login">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/book-store' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiLogIn className={`w-5 h-5 rotate-180 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Sign In</span>
                                </a>
                            </Link>}


                    </div>
                </div>
            </div>

            <div className='hidden sm:hidden md:block lg:block xl:block 2xl:block'>
                <div className={`flex flex-col h-[85vh] sticky ${menuExpanded ? ' w-48' : 'w-16'}  relative transition-all duration-100 lg:top-20 md:top-16 sm:top-14 top-12 lg:mb-8 md:mb-6 sm:mb-4 mb-2 px-2 py-6 bg-white  dark:bg-slate-800 rounded-r-xl shadow-lg`}>
                    <button onClick={menuExpandChange} className="absolute ring-2 top-3 -right-3 ring-slate-100 dark:ring-slate-900 bg-white rounded-full dark:bg-gray-800 text-gray-600 transition-colors duration-200 transform dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ">{menuExpanded ? <BiChevronLeft className='w-6 h-6 mx-auto' /> : <BiChevronRight className='w-6 h-6 mx-auto' />}</button>
                    <Link passHref href="/">
                        <a className="inline-flex items-center mx-auto text-black-800 text-2xl md:text-3xl font-bold gap-2" aria-label="logo">
                            {darkmode == true ? <Image src={`${menuExpanded == true ? '/tutionAppWhite.svg' : '/tutionAppIcon.svg'}`} height={30} width={`${menuExpanded ? 130 : 30}`} /> : <Image src={`${menuExpanded ? '/tutionApp.svg' : '/tutionAppIcon.svg'}`} height={30} width={`${menuExpanded ? 130 : 30}`} />}
                        </a>
                    </Link>
                    <Link href='/posts/new' passHref>
                        <a type="button" className=" mt-6 inline-flex items-center bg-gray-900 transition-colors duration-200 hover:bg-gray-700 hover:text-white text-gray-200 active:text-white text-sm md:text-base font-semibold rounded-lg gap-2 px-2.5 py-2">
                            <BiPlus className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                            {menuExpanded ? 'New Post' : ''}
                        </a>
                    </Link>
                    <div className="flex flex-col justify-between flex-1 mt-4">
                        <nav>
                            <Link passHref href="/inbox">
                                <a className={`flex items-center px-2 py-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/inbox' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiEnvelope className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Inbox</span>
                                </a>
                            </Link>
                            <Link passHref href="/posts">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == `/posts` || router.pathname == `/posts/my-area` || router.pathname == `/posts/[postId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiFile className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Posts</span>
                                </a>
                            </Link>
                            <Link passHref href="/tutors">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == `/tutors` || router.pathname == `/tutors/my-area` || router.pathname == `/tutors/[userId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiGroup className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Tutors</span>
                                </a>
                            </Link>
                            <Link passHref href="/followings">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == `/followings` || router.pathname == `/user/[userId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiHeart className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Followings</span>
                                </a>
                            </Link>
                            <Link passHref href="/books">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/books' || router.pathname == `/books/[bookId]` ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiGridAlt className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Books</span>
                                </a>
                            </Link>
                            <hr className="my-3 border-gray-200 dark:border-gray-600" />
                        </nav>
                        <nav className=' bottom-0'>
                            <Link passHref href="/settings">
                                <a className={`flex items-center px-2 py-2 mt-2  text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/settings' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiCog className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Settings</span>
                                </a>
                            </Link>
                            <button onClick={handleThemeClick} className={`flex items-center px-2 py-2 w-full mt-2  ${menuExpanded == true ? '' : 'mx-auto'} text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 `} >
                                {darkmode == true ?
                                    <>
                                        <BiSun className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                        <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Light mode</span>
                                    </> : <>
                                        <BiMoon className={`w-5 h-5 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                        <span className={`mx-4 font-medium  ${menuExpanded == true ? 'block' : 'hidden'}`}>Dark mode</span>
                                    </>
                                }

                            </button>
                        </nav>
                        {user && token && (user !== null || user !== undefined) && (token !== null || token !== undefined) ?
                            <>
                                <div className="flex items-center justify-between mt-3  py-2 dark:text-gray-400 rounded-lg pr-1 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ">
                                    <Link passHref href="/profile">
                                        <img className="object-cover mx-2 rounded-md h-8 w-8 cursor-pointer" src={(ServerRoot && user.avatarImg) ? `${ServerRoot + user.avatarImg}` : "/boy.svg"} alt="avatar" />
                                    </Link>
                                    {menuExpanded ?
                                        <>
                                            <Link passHref href="/profile">
                                                <div className=' max-w-3xl overflow-x-hidden mr-1'>
                                                    <p className="mx-2 font-medium text-gray-800 dark:text-gray-200 cursor-pointer">{user.name.split(' ')[0]}</p>
                                                </div>
                                            </Link>
                                            <button onClick={(event) => logout(event)} className='hover:text-red-500 transition-colors duration-300 float-right'>
                                                <BiLogOut className='w-5 h-5 rotate-180' />
                                            </button>
                                        </> : ''}
                                </div>
                            </> :
                            <Link passHref href="/login">
                                <a className={`flex items-center px-2 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-200 hover:text-gray-700 ${router.pathname == '/book-store' ? 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200 text-gray-700' : ''}`} >
                                    <BiLogIn className={`w-5 h-5 rotate-180 ${menuExpanded == true ? '' : 'mx-auto'}`} />
                                    <span className={`mx-4 font-medium ${menuExpanded == true ? 'block' : 'hidden'}`}>Sign In</span>
                                </a>
                            </Link>
                        }
                    </div>
                </div >
            </div>
        </>
    );
}



export default SideNav;