import { BiEdit, BiTrash } from "react-icons/bi";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import Link from "next/link";
import LocationSelector from "../../../components/LocationSelector";
import { parseCookies } from "nookies";
import axios from "axios";
import FormData from 'form-data';
import { AppContext } from "../../_app";
import head from "next/head";


function Edit({ userData, token }) {
    const { setUser, } = useContext(AppContext);
    // const ApiServer = process.env.NEXT_PUBLIC_API_URL
    // const ServerRoot = process.env.NEXT_PUBLIC_ROOT_URL
    const coverRef = useRef(null)
    const avatarRef = useRef(null)
    const router = useRouter();
    const [education, setEducation] = useState([
        { exam: '', dep: '', result: '', year: '', institute: '' },

    ])



    const [coverLocal, setCoverLocal] = useState(null);
    const [avatarLocal, setAvatarLocal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [userBio, setUserBio] = useState('');
    const [userClass, setUserClass] = useState('');
    const [userSubjects, setUserSubjects] = useState('');
    const [userInstitute, setUserInstitute] = useState('');
    const [userDepartment, setUserDepartment] = useState('');
    const [userAge, setUserAge] = useState('');
    const [userGender, setUserGender] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userCover, setUserCover] = useState(null);
    const [userAvatar, setUserAvatar] = useState(null);
    const [userCoverNew, setUserCoverNew] = useState();
    const [userAvatarNew, setUserAvatarNew] = useState();

    const [sending, setSending] = useState(false);


    const [divission, setDivission] = useState('');
    const [district, setDistrict] = useState('');
    const [upozilla, setUpozilla] = useState('');
    const [union, setUnion] = useState('');


    const [start, setStart] = useState(false);

    //-----------auth-check
    useEffect(() => {
        if (!token || token == null) {
            router.push('/login')
        } else {
            if (userData) {
                setStart(!start)
                setUserId(userData.user._id);
                setUserName(userData.user.name);
                setEmail(userData.user.email);
                setUserBio(userData.user.bio);
                setUserClass(userData.user.class);
                setUserSubjects(userData.user.subjects);
                setUserAge(userData.user.age);
                setUserInstitute(userData.user.institute);
                setUserDepartment(userData.user.department);
                setUserGender(userData.user.gender);
                setUserRole(userData.user.role);
                setUserCover(userData.user.coverImg);
                setUserAvatar(userData.user.avatarImg);
                setDivission(userData.user.divission);
                setDistrict(userData.user.district);
                setUpozilla(userData.user.upozilla);
                setUnion(userData.user.union);
                setStart(!start);
                if (userData.user.education.length !== 0) {
                    // setEducation([{ exam: '', dep: '', result: '', year: '', institute: '' }]);
                    setEducation(userData.user.education);
                }
                setLoading(false);
            } else {
                router.push('/login')
            }

        }
    }, []);



    const handleChangeEducationField = (index, event) => {
        const values = [...education];
        values[index][event.target.name] = event.target.value;
        setEducation(values);
    }
    const handlAddEducationField = () => {
        setEducation([...education, { exam: '', dep: '', result: '', year: '', institute: '' }]);
    }
    const handlRemoveEducationField = (index) => {
        const values = [...education];
        values.splice(index, 1)
        setEducation(values);
    }
    const handleLocationChanger = (div, dis, upo, uni) => {
        setDivission(div);
        setDistrict(dis);
        setUpozilla(upo);
        setUnion(uni)
    }
    const upload = (e, t) => {
        const file = e.target.files[0]
        if (file) {
            if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
                if (file.size <= 1.5 * 1024 * 1024) {
                    if (t == 'cover') {
                        setUserCoverNew(file)
                        let fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = (event) => {
                            setCoverLocal(event.target.result)
                        }
                    } else if (t == 'avatar') {
                        setUserAvatarNew(file)
                        let fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = (event) => {
                            setAvatarLocal(event.target.result)
                        }
                    }
                } else {
                    Swal.fire({
                        title: 'Oops',
                        text: `File size is too large.Only 1 MB is allowed`,
                        icon: 'error',
                        confirmButtonColor: '#6366f1',
                        confirmButtonText: 'Ok',
                        timer: 1500
                    })
                }
            } else {
                Swal.fire({
                    title: 'Oops',
                    text: "Only PNG and JPEG format is supported.",
                    icon: 'error',
                    confirmButtonColor: '#6366f1',
                    confirmButtonText: 'Ok',
                    timer: 1500
                })
            }
        }
    }


    //---------Save handler

    let formData = new FormData();
    formData.append('name', userName);
    formData.append('email', email);
    formData.append('age', userAge);
    formData.append('gender', userGender);
    formData.append('bio', userBio);
    formData.append('divission', divission);
    formData.append('district', district);
    formData.append('upozilla', upozilla);
    formData.append('union', union);
    formData.append('subjects', userSubjects);
    formData.append('class', userClass);
    formData.append('institute', userInstitute);
    formData.append('department', userDepartment);
    formData.append('education', JSON.stringify(education));
    if (userCoverNew) {
        formData.append('cover', userCoverNew);
    }
    if (userAvatarNew) {
        formData.append('avater', userAvatarNew);
    }

    const handleSave = (e) => {
        setSending(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/edit/${userId}`, formData, {
            headers: {
                'token': token,
                "Content-Type": "multipart/form-data",
            }
        }).then((res) => {
            setUser(res.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setSending(false)
            Swal.fire({
                title: 'Saved',
                text: 'Successfully saved',
                icon: 'success',
                confirmButtonColor: '#6366f1',
                confirmButtonText: 'Ok',
                timer: 1500
            })
        }).catch((res) => {
            Swal.fire({
                title: 'OOps',
                text: res || 'Something went wrong',
                icon: 'error',
                confirmButtonColor: '#6366f1',
                confirmButtonText: 'Ok',
                timer: 1500
            })
        })
    }
    // console.clear();
    if (loading) {
        return (
            <div></div>
        );
    }

    //-----------
    let profileImg;
    if (userAvatarNew) {
        profileImg = avatarLocal
    } else {
        if (!userAvatar || userAvatar === "") {
            if (userGender == 'male') {
                profileImg = `/boy.svg`
            } else if (userGender == 'female') {
                profileImg = `/girl.svg`
            } else {
                profileImg = `/boy.svg`
            }
        } else {
            profileImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${userAvatar}`
        }
    }
    //-------------
    let coverImg;
    if (userCoverNew) {
        coverImg = coverLocal
    } else {

        if (!userCover || userCover === "") {
            coverImg = `/cover.svg`
        } else {
            coverImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${userCover}`
        }
    }
    //------------------
    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Edit account</title>
            </head>
            <div className=" h-full w-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className=" w-full px-4  md:px-8 mx-auto">
                    <div className=" w-full flex items-center justify-center px-8 py-4 mx-auto  bg-white dark:bg-slate-800 shadow-lg rounded-t-lg">
                        <div className="w-full md:w-6/12">
                            <input type="file" ref={coverRef} onChange={e => upload(e, 'cover')} className='hidden' />
                            <input type="file" ref={avatarRef} onChange={e => upload(e, 'avatar')} className='hidden' />
                            <div className='flex justify-center w-full h-60 relative mt-2 border-4 bg-slate-900 rounded-lg border-indigo-500 '>
                                <button onClick={() => { coverRef.current.click() }} className={`absolute top-3 right-3  flex items-center px-2 py-2  rounded-md bg-indigo-500/50`} >
                                    <BiEdit className={`text-gray-300 transition-colors duration-200 hover:text-white w-5 h-5`} />
                                </button>
                                <img className="object-cover w-full" src={coverImg} alt='Cover image' />
                            </div>
                            <div className="flex justify-center -mt-20 ">
                                <div className='relative z-10 w-40 h-40 overflow-hidden border-4 bg-slate-900 rounded-full border-indigo-500'>
                                    <button onClick={() => { avatarRef.current.click() }} className={`absolute bottom-0 w-full flex justify-center items-center px-2 py-2  rounded-md bg-indigo-500/50`} >
                                        <BiEdit className={`text-gray-300 transition-colors duration-200 hover:text-white w-5 h-5`} />
                                    </button>
                                    <img src={profileImg} alt='Profile image' />
                                </div>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                <div className="w-full">
                                    <input type="text" onChange={e => setUserName(e.target.value)} value={userName} className="block text-center text-2xl w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                </div>
                            </div>
                            <div className="w-full">
                                <textarea onChange={e => setUserBio(e.target.value)} value={userBio} className="block w-full resize-none h52 px-4 text-center py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" >

                                </textarea>
                            </div>
                        </div>

                    </div>
                    <section className="w-full p-6 mx-auto bg-white rounded-b-md shadow-md dark:bg-slate-800">
                        {userRole !== 'tutor' && userRole !== 'admin' && userRole !== 'super' ?
                            <div className="flex flex-col sm:flex-row justify-between items-center bg-red-200/50 dark:bg-red-900/30 rounded-lg gap-4 p-4 md:p-8 ">
                                <div>
                                    <h2 className="text-red-500 text-xl md:text-2xl text-center md:text-left font-bold">Please note!</h2>
                                    <p className="text-red-500 dark:text-red-300">The following details will appear in your profile only if you are a tutor (pro member)</p>
                                </div>
                                <div>
                                    <Link passHref href="/settings/profile/upgrade">
                                        <a className="inline-block bg-amber-500 hover:bg-amber-600 active:bg-amber-700 focus-visible:ring ring-amber-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Upgrade</a>
                                    </Link>
                                </div>
                            </div> : ''
                        }

                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Preferable Class</label>
                                <input type="text" onChange={e => setUserClass(e.target.value)} value={userClass} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Teaching Subjects</label>
                                <input type="text" onChange={e => setUserSubjects(e.target.value)} value={userSubjects} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>

                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >My Age</label>
                                <input type="text" onChange={e => setUserAge(e.target.value)} value={userAge} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Gender</label>
                                <div className="relative mt-2">
                                    <select value={userGender} onChange={e => setUserGender(e.target.value)} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring appearance-none pr-8 rounded leading-tight " id="grid-state">
                                        <option value={'male'} >Male</option>
                                        <option value={'female'}  >Female</option>
                                        <option value={'custom'} >Custom</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Institute</label>
                                <input type="text" onChange={e => setUserInstitute(e.target.value)} value={userInstitute} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>
                        </div>

                        <div className="w-full mt-4">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Department</label>
                                <input type="text" onChange={e => setUserDepartment(e.target.value)} value={userDepartment} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Email (this email address is only used for your payment)</label>
                                <input type="email" onChange={e => setEmail(e.target.value)} value={email} className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>
                        </div>
                        <div className="w-full mt-4">
                            <label className="text-gray-700 dark:text-gray-200" >Location</label>

                            <LocationSelector change={handleLocationChanger} divission={divission} district={district} upozilla={upozilla} union={union} start={start} />
                        </div>

                        <div className="p-4 border rounded-lg border-indigo-500 ">
                            <h2 className="text-lg font-semibold text-left text-gray-700 capitalize dark:text-white">Education</h2>
                            {education.map((row, index) => (
                                <div key={index} className="grid grid-cols-1 border p-4 rounded gap-6 mt-1 md:grid-cols-6">
                                    <div>
                                        <input placeholder="Exam" onChange={event => handleChangeEducationField(index, event)} value={row.exam} name='exam' type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>

                                    <div>
                                        <input placeholder="Sec/Dep" onChange={event => handleChangeEducationField(index, event)} value={row.dep} name='dep' type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>

                                    <div>
                                        <input placeholder="Result" onChange={event => handleChangeEducationField(index, event)} value={row.result} name='result' type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div>
                                        <input placeholder="Year" onChange={event => handleChangeEducationField(index, event)} value={row.year} name='year' type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div>
                                        <input placeholder="Institution" onChange={event => handleChangeEducationField(index, event)} value={row.institute} name='institute' type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-slate-800 dark:text-gray-300 dark:border-indigo-500 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => handlRemoveEducationField(index)} className="w-10  h-10 mt-2 flex justify-center items-center shrink-0 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg shadow-lg transition duration-100">
                                            <BiTrash className='w-6 h-6' />
                                        </button>
                                    </div>

                                </div>
                            ))}
                            <div className="flex justify-center mt-6">
                                <button onClick={handlAddEducationField} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:bg-slate-600">Add new row</button>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button onClick={(event) => handleSave(event)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:bg-slate-600">{sending?'Saving...':'Save'}</button>
                        </div>

                    </section>


                </div>
            </div>


        </div>
    );
}
export async function getServerSideProps(ctx) {
    let token = parseCookies(ctx).authToken || null;
    if (token) {
        let res;
        try {
            res = await fetch(`${process.env.API_URL}/my-profile`, {
                headers: {
                    token: token
                }
            })
        } catch (error) {
            res = await fetch(`${process.env.API_URL}/my-profile`, {
                headers: {
                    token: token
                }
            })
        }
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

export default Edit;