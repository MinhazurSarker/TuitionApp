import axios from 'axios';
import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import Swal from 'sweetalert2';

function WriteReview({ userId, token, updateRatings }) {
    const [rating, setRating] = useState(0);
    const [desc, setDesc] = useState('');
    const changeRating = (newRating, name) => {
        setRating(newRating)
    }
    const handleRate = async (e) => {
        e.preventDefault();
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/rate/${userId}`, { stars: rating, desc: desc }, {
            headers: {
                token: token
            }
        }).then(async (res) => {
            setRating(0)
            setDesc('')
            updateRatings()
            Swal.fire({
                icon: 'success',
                title: 'Successful',
                text: res.data.msg,
            })
        }).catch((res) => {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: res.data.msg,
            })
        })
    }

    return (
        <div className='p-8 mb-6 bg-slate-200 dark:bg-slate-700 rounded-lg shadow-lg'>
            <div className="">
                <p className="mt-2 my-6 text-lg text-center font-semibold text-gray-800 dark:text-gray-200 md:mt-0 ">Write a Review</p>
            </div>
            <div className="w-full mt-4 flex justify-center">
                <
                    // @ts-ignore
                    StarRatings
                    rating={rating}
                    changeRating={changeRating}
                    starRatedColor="#FACC32"
                    starEmptyColor='#0f172a'
                    starDimension='40px'
                    starSpacing='1px'
                    starHoverColor='#FAFC50'
                    numberOfStars={5}
                    name='rating'
                /><br />
            </div>
            <div className="w-full mt-4">
                <textarea value={desc} onChange={(event) => { setDesc(event.target.value) }} className="block w-full min-h-max h-34 px-4 py-2 text-slate-700 bg-white border rounded-md dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"></textarea>
            </div>
            <div className="flex justify-center mt-6">
                <button onClick={(event) => { handleRate(event) }} className="px-4 py-2 text-white transition-colors duration-200 transform bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Done</button>
            </div>
        </div>
    );
}

export default WriteReview;