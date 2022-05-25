import moment from 'moment';
import Image from 'next/image'
import Link from 'next/link';
import { useEffect, useState } from 'react';
function NotificationCard({ data,author }) {

    const [postId, setPostId] = useState('');
    const [title, setTitle] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    useEffect(() => {
        if (data._id) {
            setPostId(data.postId)
            setTitle(data.title)
            setCreatedAt(data.createdAt)
            if (author) {  
                setAvatar(author.avatarImg)
                setName(author.name)            
            }
        } else { }
        return () => {
        };

    }, []);

    let profileImg;
    if (!avatar || avatar === "") {
        profileImg = `/boy.svg`
    } else {
        profileImg = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${avatar}`
    }
    return (
        <Link passHref href={`/posts/${postId}`}>
            <div className="w-full mx-auto overflow-hidden bg-white text-gray-700 dark:text-gray-200 mt-6 rounded-lg shadow-md dark:bg-slate-800 cursor-pointer">
                <div className="p-6">
                    <div>
                        <h1 className="block mt-2 text-2xl   transition-colors duration-200 transform ">{title}</h1>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="h-10 w-10 relative rounded-full overflow-hidden">
                                    <Image layout='fill' objectFit="cover" loader={() => profileImg} src={profileImg} />
                                </div>
                                <p className='mx-2  text-gray-700 dark:text-gray-200'>{name}</p>
                            </div>
                            <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">{moment(createdAt).fromNow()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}



export default NotificationCard;