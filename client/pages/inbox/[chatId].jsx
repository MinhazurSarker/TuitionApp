import axios from "axios";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import Swal from "sweetalert2";
import MessageComp from "../../components/MessageComp";
import { io } from "socket.io-client";
import head from "next/head";

function ChatInbox({ messagesRes, currentUser, token, friendId }) {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER);
    const router = useRouter();

    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const imageRef = useRef(null)
    const scrollRef = useRef(null)


    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [current, setCurrent] = useState([]);
    const [friend, setFriend] = useState([]);

    useEffect(() => {
        socket.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.sender,
                text: data.text,
                chatId: data.chatId,
                image: data.image,
                createdAt: Date.now(),

            });
            scrollRef.current.scroll({ top: scrollRef.current.scrollHeight })

        });
        socket.on("connect_error", (data) => {
            Swal.fire({
                text: 'Error'
            })
        });
    }, []);
    useEffect(() => {
        setMessages([...messages, arrivalMessage]);
        scrollRef.current.scroll({ top: scrollRef.current.scrollHeight })

    }, [arrivalMessage]);

    useEffect(() => {
        socket.emit('addUser', currentUser)
        scrollRef.current.scroll({ top: scrollRef.current.scrollHeight })

        return () => {
            socket.disconnect()
        };
    }, [currentUser, token]);

    useEffect(() => {
        if (friendId == null) {
            router.push('/404')
        } else {
            if (!token || token == null) {
                router.push('/login')
            } else {
                if (messagesRes && currentUser && friendId) {
                    setMessages(messagesRes)
                    setCurrent(currentUser)
                    setFriend(friendId)
                    socket.emit('addUser', currentUser)
                } else {
                    router.push('/login')
                }
            }
        }
        return () => { socket.disconnect() };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        socket.emit('sendMessage', { sender: current, receiverId: friend, chatId: router.query.chatId, text: text, image: image })
        setMessages([...messages, { sender: current, chatId: router.query.chatId, text: text, image: image }])
        setText('');
        setImage(null)
        scrollRef.current.scroll({ top: scrollRef.current.scrollHeight })

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/message/`,
            {
                chatId: router.query.chatId,
                text: text,
                image: image,
            },
            {
                headers: {
                    token: token
                }
            }
        ).then(() => {
        }).catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: "Something went wrong..! ",
            })
        });
    }

    const upload = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
                if (file.size <= 1024 * 1024) {
                    let fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = (event) => {
                        setImage(event.target.result)
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

    return (
        <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
            <head>
                <title>TuitionApp - Inbox</title>
            </head>
            <div className=" basis-full h-full lg:mb-8 md:mb-6 sm:mb-4 mb-2">
                <div className="max-w-screen-xl px-4  md:px-8 mx-auto">
                    <div className="flex flex-col items-center rounded-lg justify-center min-h-[85vh] bg-white dark:bg-slate-800 text-gray-800 bg:text-gray-200">
                        <div className="flex flex-col flex-grow w-full bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
                            <div ref={scrollRef} className=" flex flex-col flex-grow h-0 p-4 overflow-y-scroll">
                                {messages.map((item, i) => (
                                    <MessageComp key={i} own={item.sender == current} img={item.image} text={item.text} time={item.createdAt} />
                                ))}
                                <div className="h-10 bg-red"></div>
                            </div>
                            <div className="bg-gray-300 flex flex-col dark:bg-slate-700 p-4">
                                {image ?
                                    <img src={image} className='m-1 rounded-sm mb h-16 w-16 object-cover' alt="image" />
                                    : ''}
                                <div className="flex w-full">
                                    <input ref={imageRef} onChange={event => upload(event)} type="file" hidden />
                                    <button onClick={() => { imageRef.current.click() }} className="w-10 ml-1 focus:border-0 md:w-12 h-10 flex justify-center items-center shrink-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-l-lg shadow-lg transition duration-100">
                                        <BsImage className='w-6 h-6' />
                                    </button>
                                    <input value={text} onChange={e => setText(e.target.value)} className=" bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 items-center h-10 w-full px-3 text-sm" type="text" placeholder="Type your message…" />
                                    <button onClick={(event) => { handleSend(event) }} className="w-10 mr-1 focus:border-0 md:w-12 h-10 flex justify-center items-center shrink-0 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-r-lg shadow-lg transition duration-100">
                                        <BiSend className='w-6 h-6' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export async function getServerSideProps(ctx) {

    const token = parseCookies(ctx).authToken || null

    if (token) {
        const res = await fetch(`${process.env.API_URL}/messages/${ctx.query.chatId}`, {
            headers: {
                token: token
            }
        })
        const data = await res.json()
        return {
            props: {
                messagesRes: data.messages,
                currentUser: data.currentUser,
                friendId: data.friendId,
                token: token
            },
        };
    } else {
        return {
            props: {
                messagesRes: null,
                currentUser: null,
                friendId: null,
                token: null
            },
        };
    }
}
export default ChatInbox;

