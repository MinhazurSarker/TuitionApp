
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function UserChatCard({chat,currentUser}) {
    
    const [name, setName] = useState('');
    const [avatarImg, setAvatarImg] = useState('');
    const friendId = chat.members.find((m) => m !== currentUser);

    useEffect(() => {
        data()
        return () => { };
    }, []);
    async function data() {
        await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${friendId}`)).json().then(data => {
            setName(data.name)
            setAvatarImg(data.avatarImg)
        })
    }
    let profileImg;
    if (!avatarImg || avatarImg === "") {
            profileImg = `/boy.svg`
    } else {
        profileImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${avatarImg}`
    }
    return (
        <Link href={`/inbox/${chat._id}`}>
            <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 lg:p-8 cursor-pointer">
                <div className="w-24 relative md:w-32 h-24 md:h-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-lg mb-2 md:mb-4">
                    <img src={profileImg} loading="lazy" alt="" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                    <div className="text-indigo-500 md:text-lg font-bold text-center">{name}
                    </div>
                </div>
            </div>
        </Link>
    );
}


export default UserChatCard;