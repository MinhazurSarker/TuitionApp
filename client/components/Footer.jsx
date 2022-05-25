import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookSquare, FaLinkedin, FaTwitterSquare, FaYoutubeSquare } from 'react-icons/fa'

function Footer() {
    const ApiServer = process.env.NEXT_PUBLIC_API_URL
    const [linkFb, setLinkFb] = useState('')
    const [linkIn, setLinkIn] = useState('')
    const [linkTw, setLinkTw] = useState('')
    const [linkYt, setLinkYt] = useState('')
    const [linkPhone, setLinkPhone] = useState('')
    const [linkPs, setLinkPs] = useState('')
    const [linkAs, setLinkAs] = useState('')
    const [linkTxt, setLinkTxt] = useState('')
    useEffect(() => {
        fetchData()
        return () => { };
    }, []);

    async function fetchData() {
        await (await fetch(`${ApiServer}/footer-links`)).json().then(data => {
            setLinkFb(data.links.fb);
            setLinkIn(data.links.in);
            setLinkTw(data.links.tw);
            setLinkYt(data.links.yt);
            setLinkPhone(data.links.phone);
            setLinkPs(data.links.ps);
            setLinkAs(data.links.as);
            setLinkTxt(data.links.txt);
        })
    }

    return (
        <div className="bg-slate-800 mt-6 md:mt-0">
            <footer className="max-w-screen-2xl px-4 md:px-8 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5  gap-12 lg:gap-8 pt-10 lg:pt-12 mb-16">
                    <div className="col-span-full lg:col-span-2">
                        <div className="flex items-center justify-center sm:justify-start">
                            <div className="lg:-mt-2 mb-4">
                                <Link href="/">
                                    <a className="inline-flex items-center text-gray-100 text-xl md:text-2xl font-bold gap-2" aria-label="logo">
                                        <Image src='/tutionAppWhite.svg' height={35} width={150} />
                                    </a>
                                </Link>
                            </div>
                        </div>

                        <p className="text-gray-400 text-center sm:text-left sm:pr-8 mb-6">{linkTxt}</p>
                        <div className="flex justify-center sm:justify-start gap-4">
                            {linkFb !== '' ?
                                <Link href={linkFb} passHref>
                                    <a target="_blank" className="text-gray-200 hover:text-indigo-500 transition-all duration-300">
                                        <FaFacebookSquare className='w-6 h-6' />
                                    </a>
                                </Link> : ''
                            }
                            {linkIn !== '' ?
                                <Link href={linkIn} passHref>
                                    <a target="_blank" className="text-gray-200 hover:text-indigo-500 transition-all duration-300">
                                        <FaLinkedin className='w-6 h-6' />
                                    </a>
                                </Link> : ''
                            }
                            {linkTw !== '' ?
                                <Link href={linkTw} passHref>
                                    <a target="_blank" className="text-gray-200 hover:text-indigo-500 transition-all duration-300">
                                        <FaTwitterSquare className='w-6 h-6' />
                                    </a>
                                </Link> : ''
                            }
                            {linkYt !== '' ?
                                <Link href={linkYt} passHref>
                                    <a target="_blank" className="text-gray-200 hover:text-indigo-500 transition-all duration-300">
                                        <FaYoutubeSquare className='w-6 h-6' />
                                    </a>
                                </Link> : ''
                            }
                        </div>
                        <p className="text-gray-400 text-center sm:text-left sm:pr-8 my-6"><a href={`tel:${linkPhone}`}>For any issues: {linkPhone}</a></p>
                        <div className="flex items-center justify-center sm:justify-start gap-6 mt-8">
                            <>
                                {linkPs.toString() !== '' ?
                                    <>
                                        <Link href={linkPs} passHref>
                                            <a >
                                                <div className="flex mt-3 w-48 h-14 bg-black text-white rounded-lg items-center justify-center">
                                                    <div className="mr-3">
                                                        <svg viewBox="30 336.7 120.9 129.2" width="30">
                                                            <path fill="#FFD400" d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z" />
                                                            <path fill="#FF3333" d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z" />
                                                            <path fill="#48FF48" d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z" />
                                                            <path fill="#3BCCFF" d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs">GET IT ON</div>
                                                        <div className="text-xl font-semibold font-sans -mt-1">Google Play</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </> : ''
                                }
                            </>
                            <>
                                {linkAs.toString() !== "" ?
                                    <>
                                        <Link href={linkAs} passHref>
                                            <a >
                                                <div className="flex mt-3 w-48 h-14 bg-black text-white rounded-xl items-center justify-center">
                                                    <div className="mr-3">
                                                        <svg viewBox="0 0 384 512" width="30" >
                                                            <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs">Download on the</div>
                                                        <div className="text-2xl font-semibold font-sans -mt-1">App Store</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </>
                                    : ''
                                }
                            </>
                        </div>

                    </div>


                    <div>
                        <div className="text-gray-100 font-bold tracking-widest uppercase mb-4">User terms</div>

                        <nav className="flex flex-col gap-4">
                            <div>
                                <Link href="/terms">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Terms and Conditions</a>
                                </Link>
                            </div>

                            <div>
                                <Link href="/policies">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Policies</a>
                                </Link>
                            </div>

                            <div>
                                <Link href="/disclaimers">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Disclaimer</a>
                                </Link>
                            </div>
                        </nav>
                    </div>

                    <div>
                        <div className="text-gray-100 font-bold tracking-widest uppercase mb-4">Company</div>

                        <nav className="flex flex-col gap-4">
                            <div>
                                <Link href="/about">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">About us</a>
                                </Link>
                            </div>
                            <div>
                                <Link href="/contact">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Contact us</a>
                                </Link>
                            </div>
                            <div>
                                <Link href="/login">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Login</a>
                                </Link>
                            </div>


                        </nav>
                    </div>


                    <div>
                        <div className="text-gray-100 font-bold tracking-widest uppercase mb-4">Other Links</div>

                        <nav className="flex flex-col gap-4">
                            <div>
                                <Link href="/books">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Book store</a>
                                </Link>
                            </div>

                            <div>
                                <Link href="/tutors">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Tutors</a>
                                </Link>
                            </div>

                            <div>
                                <Link href="/posts">
                                    <a className="text-gray-400 hover:text-indigo-500 active:text-indigo-600 transition duration-100">Posts</a>
                                </Link>
                            </div>
                        </nav>
                    </div>

                </div>

                <div className="text-gray-200 text-lg font-semibold text-center border-t border-gray-800 pt-4">© 2021 - {new Date().getFullYear()} <Link href="/about" passHref><a className="text-indigo-500" >TuitionApp</a></Link> . All rights reserved.</div>
                <div className="text-gray-400 text-xs text-center border-t border-gray-800 pt-1 pb-4">Developed and managed by <Link href="https://cellsweb.com/" passHref><a target='_blank' className="text-[#FF6B26]" >Cellsweb IT Solutions Ltd</a></Link></div>
            </footer>
        </div>
    );
}



export default Footer;