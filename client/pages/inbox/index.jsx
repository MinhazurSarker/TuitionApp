import head from 'next/head'
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import UserChatCard from "../../components/UserChatCard";
function Inbox({ chats, current, token }) {
    const router = useRouter();

    const [chatsArray, setChatsArray] = useState([]);
    const [currentUserId, setCurrentUserId] = useState();

    useEffect(() => {
        if (!token || token == null) {
            router.push('/login')
        } else {
            setChatsArray(chats)
            setCurrentUserId(current)
        }
        return () => {
        };

    }, []);

    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Inbox</title>
            </head>
            <div className="basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className="flex justify-between items-center gap-4 mb-6">
                        <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold">Inbox</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
                        {chatsArray.map((item, i) => (
                            <UserChatCard key={i} chat={item} currentUser={currentUserId} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function getServerSideProps(ctx) {
    let token = parseCookies(ctx).authToken || null;
    const res = await fetch(`${process.env.API_URL}/chats/`, {
        headers: {
            token: token
        }
    })
    const data = await res.json()

    if (data.chats) {
        return {
            props: {
                chats: data.chats,
                current: data.currentUser,
                token: token
            },
        };
    } else {
        return {
            props: {
                chats: [],
                current: null,
                token: token
            },
        };
    }
}

export default Inbox;