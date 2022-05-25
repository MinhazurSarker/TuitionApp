import axios from "axios";
import head from 'next/head'
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ContactUs() {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [subjects, setSubjects] = useState('');
    const [desc, setDesc] = useState('');
    const [lan, setLan] = useState(0);
    const [lon, setLon] = useState(0);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setLan(position.coords.latitude);
                setLon(position.coords.longitude);
            });
        }
    }, []);
    const data = {
        name: name,
        company: company,
        phone: phone,
        email: email,
        subjects: subjects,
        lan: lan,
        lon: lon,
        desc: desc,
    }
    const submit = (e) => {
        e.preventDefault();
        if (lan == 0 || lon == 0) {
            Swal.fire({
                title: 'Location is required',
                text: "Please allow the location access from your browser",
                icon: 'error',
                confirmButtonColor: '#6366f1',
                confirmButtonText: 'Ok'
            })
        } else {
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                setName('');
                setCompany('');
                setPhone('');
                setEmail('');
                setSubjects('');
                setDesc('');
                Swal.fire({
                    title: 'Success',
                    text: "Thanks for contacting us",
                    confirmButtonColor: '#6366f1',
                    confirmButtonText: 'Ok'
                })
            })
        }
    }
    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Contact us</title>
            </head>
            <div className="w-full px-12 md:px-8 mx-auto  lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <div className="container px-12 py-16 mx-auto">
                        <div className="mb-8 md:mb-12">
                            <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">Contact us</h2>
                            <section className="max-w-4xl p-6 mx-auto ">
                                <form>
                                    <div className='mt-4'>
                                        <label className="text-gray-700 dark:text-gray-200" >Name</label>
                                        <input value={name} onChange={(event) => { setName(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-slate-200 border border-gray-200 rounded-md dark:bg-slate-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>

                                    <div className='mt-4'>
                                        <label className="text-gray-700 dark:text-gray-200" >Company</label>
                                        <input value={company} onChange={(event) => { setCompany(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-slate-200 border border-gray-200 rounded-md dark:bg-slate-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div className='mt-4'>
                                        <label className="text-gray-700 dark:text-gray-200" >Email</label>
                                        <input value={email} onChange={(event) => { setEmail(event.target.value) }} type="email" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-slate-200 border border-gray-200 rounded-md dark:bg-slate-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div className='mt-4'>
                                        <label className="text-gray-700 dark:text-gray-200" >Phone</label>
                                        <input value={phone} onChange={(event) => { setPhone(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-slate-200 border border-gray-200 rounded-md dark:bg-slate-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div className='mt-4'>
                                        <label className="text-gray-700 dark:text-gray-200" >Subjects</label>
                                        <input value={subjects} onChange={(event) => { setSubjects(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-slate-200 border border-gray-200 rounded-md dark:bg-slate-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div className='mt-4'>
                                        <label className="text-gray-700 dark:text-gray-200" >Description</label>
                                        <textarea value={desc} onChange={(event) => { setDesc(event.target.value) }} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-slate-200 border border-gray-200 rounded-md dark:bg-slate-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div className="flex justify-center mt-6">
                                        <button onClick={event => submit(event)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-indigo-500 rounded-md hover:bg-indigo-700 focus:outline-none ">Submit</button>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ContactUs;