import axios from "axios";
import Router from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";

function PricingCard({ plan, token }) {
    const [loading, setLoading] = useState(false);
    const handleUpgrade = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { planId: plan._id }, {
            headers: {
                token: token
            }
        }).then(res => {
            if (res.data.status == 'failed') {
                setLoading(false)
                Swal.fire({
                    icon: 'error',
                    title: 'OOps',
                    text: res.data.msg
                })
            } else {
                if (res.data.url) {
                    setLoading(false)      
                    Router.push(res.data.url)
                }
            }
        }).catch(res => {
            setLoading(false)
            Swal.fire({
                icon: 'error',
                title: 'OOps',
                text: "Something went wrong"
            })
        })

    }
    return (
        <div className="flex flex-col border-2 border-indigo-500 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-900 rounded-lg relative p-4 pt-6">
            <div className="my-10">
                <div className="flex justify-center absolute -top-3 inset-x-0">
                    <span className="h-6 flex justify-center items-center bg-indigo-500 text-white text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1">{plan.title}</span>
                </div>
                <div className="text-gray-800 dark:text-gray-200 text-2xl font-bold text-center mb-2">{plan.days} days</div>
                <p className="text-gray-700 dark:text-gray-300 text-center mx-auto px-8 mb-8">{plan.desc}</p>
            </div>

            <div className="flex flex-col gap-8 mt-auto">
                <div className="flex justify-center items-end gap-1">
                    <span className="self-start text-gray-700 dark:text-gray-200">৳</span>
                    <span className="text-4xl text-indigo-500 font-bold">{plan.amount}</span>
                    <span className="text-gray-700 dark:text-gray-200">/user/month</span>
                </div>
                <button onClick={e => handleUpgrade(e)} className="block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">{loading?'Please Wait':'Upgrade'}</button>
            </div>
        </div>
    );
}

export default PricingCard;