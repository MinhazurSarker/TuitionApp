import Link from 'next/link';
import StarRatings from 'react-star-ratings';

function Review({ rate }) {
    const ServerRoot = process.env.NEXT_PUBLIC_BACKEND_URL
    let profileImg;
    if (!rate.postedBy.avatarImg || rate.postedBy.avatarImg === "") {
        if (rate.postedBy.gender == 'male') {
            profileImg = `/boy.svg`
        } else if (rate.postedBy.gender == "female") {
            profileImg = `/girl.svg`
        } else {
            profileImg = `/boy.svg`
        }
    } else {
        profileImg = `${ServerRoot}/${rate.postedBy.avatarImg}`
    }


    return (
        <div className="w-full mx-auto mb-4 overflow-hidden bg-slate-100 rounded-lg shadow-md dark:bg-slate-700">
            <div className="p-6">
                <div>
                    <div className='flex justify-between items-center'>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <img className="object-cover h-10 rounded-full" src={profileImg} alt="Avatar" />
                                <Link passHref href="/user/[userId]" as={`/user/${rate.postedBy._id}`}>
                                    <a className="mx-2 font-semibold text-gray-700 dark:text-gray-200">{rate.postedBy.name}</a>
                                </Link>
                            </div>
                            <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">21 SEP 2015</span>
                        </div>
                        <div className="flex items-center">
                            <
                                // @ts-ignore
                                StarRatings
                                rating={rate.stars}
                                starRatedColor="#FACC32"
                                starDimension='18px'
                                starSpacing='1px'
                                numberOfStars={5}
                                name='rating'
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{rate.desc}</p>
                </div>
            </div>
        </div>
    );
}

export default Review;