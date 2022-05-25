import { useState, useContext, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import LoginComp from "../components/Login";
import Verify from "../components/Verify";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from 'sweetalert2';
import { setCookie } from 'nookies'

import { AppContext } from "./_app"
import head from "next/head";
function Login() {
    // @ts-ignore
    const { user, setUser, setToken } = useContext(AppContext);
    const ApiServer = process.env.NEXT_PUBLIC_API_URL
    const { query } = useRouter();
    const router = useRouter();
    const [step, setStep] = useState(0)
    const [phone, setPhone] = useState('88')
    const [OTP, setOTP] = useState('')
    useEffect(() => {
        return () => {
        };
    }, []);
    const login = async (e) => {
        e.preventDefault();
        if (phone.length == 13) {
            e.preventDefault();
            await axios.post(`${ApiServer}/auth?ref=${query.ref || ''}`, {
                phone: phone,
            }).then(function () {
                setStep(step + 1)
            }).catch(function () {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: "Something went wrong",
                })
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid phone number',
                text: 'Use a valid phone number (must include "88" )',
            })
        }

    }
    const back = () => {
        setStep(step - 1)
    }
    function redirect(response) {
        if (response.data.authType == 'registration') {
            Swal.fire({
                icon: 'question',
                title: 'You need to edit your details',
                text: response.data.msg,
            }).then((res) => {
                if (res.isConfirmed) {
                    router.push('/settings/profile/edit');
                } else {
                    router.push('/settings/profile/edit');
                }
            })
        } else if (response.data.authType == 'login') {
            router.push('/')
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: response.data.msg,
            })
        }
    }
    const verify = async (e) => {
        e.preventDefault();
        await axios.post(`${ApiServer}/auth/verify` + `${query.ref ? '?ref=' : ''}` + `${query.ref ? query.ref : ''}`, {
            phone: phone,
            otp: OTP
        }).then(function (response) {
            setUser(response.data.user)
            setToken(response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            setCookie(null, 'authToken', response.data.token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
            });
            redirect(response);

        }).catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: "Something went wrong",
            })
        });

    }
    const stepPage = () => {
        if (step === 0) {
            return <LoginComp phone={phone} setPhone={setPhone} login={login} />
        }
        else {
            return <Verify OTP={OTP} setOTP={setOTP} back={back} verify={verify} />
        }
    }

    return (
        <div className="">
            <head>
                <title>TuitionApp - Login</title>
            </head>
            <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
                <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                    <div className="h-[85vh] w-full flex justify-center items-center px-4  md:px-8 mx-auto">
                        {stepPage()}
                    </div>
                </div>
                <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}


export default Login;