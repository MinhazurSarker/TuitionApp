import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function ReportPost({ postData, token }) {
    const router = useRouter();
    process.env.NEXT_PUBLIC_API_URL
    const [id, setId] = useState('');
    const [reason, setReason] = useState('');
    const [desc, setDesc] = useState('');

    useEffect(() => {
        if (postData == null) {
            router.push('/404')
        } else {
            if (!token || token == null) {
                router.push('/login')
            } else {
                setId(postData._id)
            }
        }
    }, []);
    const handleReport = (e)=>{
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/report/post/${id}`,{reason:reason,desc:desc},{
            headers:{
                token:token
            }
        }).then((res)=>{
            setDesc('')
            setReason('')
            Swal.fire({
                icon: 'success',
                title: 'Successful',
                text: res.data.msg,
                timer: 1500
            })
        }).catch(res=>{
            Swal.fire({
                icon: 'error',
                title: 'OOps...',
                text: res.data.msg,
                timer: 1500
            })
        })
    }
    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <Head>
                <title>TuitionApp - Report a Post</title>
            </Head>
            <div className=" h-full w-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className=" w-full px-4  md:px-8 mx-auto">

                    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800">
                        <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">Report Post</h2>
                        <form>
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Reason</label>
                                <input value={reason} onChange={e=>setReason(e.target.value)} type="text" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" />
                            </div>
                            <div>
                                <label className="text-gray-700 dark:text-gray-200" >Description</label>
                                <textarea value={desc} onChange={e=>setDesc(e.target.value)} name="" className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring" ></textarea>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button onClick={e=>handleReport(e)} className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Post</button>
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

export default ReportPost;