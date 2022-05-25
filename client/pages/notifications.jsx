import  head  from 'next/head';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import Swal from 'sweetalert2';
import NotificationCard from '../components/NotificationCard'
import Sidebar from '../components/Sidebar'
function Notifications({ notificationsData, token }) {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [pages, setPages] = useState(1);
    const [current, setCurrent] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    useEffect(() => {
        if (!token || token == null) {
            router.push('/login')
        } else {
            setNotifications(notificationsData.notifications);
        }
        return () => {
        };

    }, []);
    
    const prevPage = (e) => {
        if (current > 1) {
            setCurrent(current - 1)
            router.push(`/my-profile/notifications/?page=${current - 1}`)
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Not available',
                text: 'This is the first page.',
                timer: 1500
            })
        }
    }
    const nextPage = (e) => {
        if (current < pages) {
            setCurrent(current + 1)
            router.push(`/my-profile/notifications/?page=${current + 1}`)
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Not available',
                text: 'This is the last page.',
                timer: 1500
            })
        }
    }


    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - My notifications</title>
            </head>
            <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className="flex justify-center items-center gap-4 mb-6">
                        <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">Notifications</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                        {notifications.map((item, index) => (
                            <NotificationCard data={item} author={item.author} key={index} />
                        ))}
                    </div>
                </div>
                <div className="flex mt-6 justify-center items-center gap-4">
                    <button onClick={e => prevPage(e)} className={` px-3 h-10 flex justify-center items-center shrink-0 ${current == 1 ? 'bg-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'}  text-white rounded-lg shadow-lg transition duration-100`}>
                        <AiOutlineLeft className='w-6 h-6' /> Prev
                    </button>
                    <div className="px-3 h-10 flex justify-center items-center shrink-0 bg-indigo-500 text-white rounded-lg shadow-lg transition duration-100">
                        {current + '/' + pages}
                    </div>
                    <button onClick={e => nextPage(e)} className={` px-3 h-10 flex justify-center items-center shrink-0 ${current == pages ? 'bg-slate-500 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700'} text-white rounded-lg shadow-lg transition duration-100`}>
                        Next <AiOutlineRight className='w-6 h-6' />
                    </button>
                </div>
            </div>
            <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full ">
                <Sidebar />
            </div>
        </div>
    );
}
export async function getServerSideProps(ctx) {
    let token = parseCookies(ctx).authToken || null;
    const res = await fetch(`${process.env.API_URL}/my-profile/notifications?page=${ctx.query.page || 1}`, {
        headers: {
            token: token
        }
    })
    const notifications = await res.json()
    return {
        props: {
            notificationsData: notifications,
            token: token
        },
    };
}
export default Notifications;