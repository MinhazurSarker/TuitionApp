import axios from "axios";
import head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LocationSelector from "../../../components/LocationSelector";

function EditPost({ postData, token }) {
    const ApiServer = process.env.NEXT_PUBLIC_API_URL

    const router = useRouter();

    const [id, setid] = useState('');
    const [desc, setdesc] = useState('');
    const [cls, setcls] = useState('');
    const [subjects, setsubjects] = useState('');
    const [days, setdays] = useState('');
    const [salary, setsalary] = useState('');
    const [lan, setLan] = useState(0);
    const [lon, setLon] = useState(0);
    const [lang, setlang] = useState('');

    const [divission, setDivission] = useState('');
    const [district, setDistrict] = useState('');
    const [upozilla, setUpozilla] = useState('');
    const [union, setUnion] = useState('');

    const [divissionNew, setDivissionNew] = useState('');
    const [districtNew, setDistrictNew] = useState('');
    const [upozillaNew, setUpozillaNew] = useState('');
    const [unionNew, setUnionNew] = useState('');

    const [start, setStart] = useState(false);


    useEffect(() => {
        if (postData == null) {
            router.push('/404')
        } else {
            if (!token || token == null) {
                router.push('/login')
            } else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        setLan(position.coords.latitude);
                        setLon(position.coords.longitude);
                    });
                } else { }
                setid(postData._id)
                setdesc(postData.desc)
                setcls(postData.class)
                setsubjects(postData.subjects)
                setdays(postData.days)
                setsalary(postData.salary)
                setlang(postData.lang)
                setDivission(postData.divission)
                setDistrict(postData.district)
                setUpozilla(postData.upozilla)
                setUnion(postData.union)
                setStart(!start);

            }
        }
    }, []);


    const handleLocationChanger = (div, dis, upo, uni) => {
        setDivissionNew(div);
        setDistrictNew(dis);
        setUpozillaNew(upo);
        setUnionNew(uni)
    }
    const data = {
        class: cls,
        days: days,
        lang: lang,
        salary: salary,
        subjects: subjects,
        divission: divissionNew,
        district: districtNew,
        upozilla: upozillaNew,
        union: unionNew,
        lan: lan,
        desc: desc,
        lon: lon
    }
    const save = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Are these all information correct?',
            text: "Please check all the information you just entered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes. Post'
        }).then((result) => {
            if (result.isConfirmed) {
                if (lan == 0 || lon == 0) {
                    Swal.fire({
                        title: 'Oops',
                        text: "Please allow the location access from your browser",
                        icon: 'error',
                        confirmButtonColor: '#6366f1',
                        confirmButtonText: 'Ok'
                    })
                } else {
                    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/post-edit/${id}`, data, {
                        headers: {
                            token: token
                        }
                    }).then(res => {
                        setStart(!start);
                        Swal.fire({
                            title: 'Success',
                            text: "Post has been deleted",
                            icon: 'success',
                            confirmButtonColor: '#6366f1',
                            confirmButtonText: 'Ok'
                        })
                    }).catch(err=>{
                        Swal.fire({
                            title: 'Oops...',
                            text: "Something went wrong",
                            icon: 'error',
                            confirmButtonColor: '#6366f1',
                            confirmButtonText: 'Ok'
                        })
                    })
                }
            }
        })
    }
    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Edit post</title>
            </head>
            <div className=" h-full w-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className=" w-full px-4  md:px-8 mx-auto">
                    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
                        <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">Edit Post</h2>

                        <form>
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Description</label>
                                <input value={desc} onChange={(event) => { setdesc(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>
                            <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" >Class</label>
                                    <input value={cls} onChange={(event) => { setcls(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" >Subjects</label>
                                    <input value={subjects} onChange={(event) => { setsubjects(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                </div>

                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" >Days/week</label>
                                    <input value={days} onChange={(event) => { setdays(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" >Salary</label>
                                    <input value={salary} onChange={(event) => { setsalary(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200" >Language</label>
                                    <input value={lang} onChange={(event) => { setlang(event.target.value) }} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                </div>
                            </div>
                            <div className=' w-full mt-4 gap-4 mb-6' >
                                <label className="text-gray-700 dark:text-gray-200" >Location</label>
                                <LocationSelector change={handleLocationChanger} divission={divission} district={district} upozilla={upozilla} union={union} start={start} />
                            </div>
                            <div className="flex justify-center mt-6">
                                <button onClick={event => save(event)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Post</button>
                            </div>
                        </form>
                    </section>
                </div>
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
export default EditPost;
