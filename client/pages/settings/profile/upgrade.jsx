import head from "next/head";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import PricingCard from "../../../components/PricingCard";

function Upgrade({ userData, token, plans }) {
    const router = useRouter();
    const [userRefs, setUserRefs] = useState(0)
    useEffect(() => {
        if (!token || token == null) {
            router.push('/login')
        } else {
            if (userData) {
                setUserRefs(userData.user.refs)
            } else {
                router.push('/login')
            }
        }
        return () => {
        };

    }, []);

    return (

        <div className=" py-6 sm:py-8 lg:py-12">
            <head>
                <title>TuitionApp - Upgrade to pro</title>
            </head>
            <div className="max-w-screen-2xl px-4 mb-8 md:px-8 mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-200 dark:bg-slate-800 rounded-lg gap-4 p-4 md:p-8 shadow-lg">
                    <div>
                        <h2 className="text-indigo-500 text-xl md:text-2xl text-center md:text-left font-bold">Upgrade using refarral points </h2>
                        <p className="text-gray-600 dark:text-gray-200">You have {userRefs} points. You can upgrade account for one 30 days consuming 3 points each upgrades </p>
                    </div>
                    <div>
                        <button className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3">Upgrade</button>
                    </div>
                </div>
            </div>
            <div className="max-w-screen-xl px-4 md:px-8 mx-auto">
                <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-8 xl:mb-12">Our pricing plans for you</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 md:mb-8">
                    {plans.map((plan, i) => (
                        <PricingCard key={i} plan={plan} token={token} />
                    ))}


                </div>
            </div>
        </div>

    );
}
export async function getServerSideProps(ctx) {
    let token = parseCookies(ctx).authToken || null;
    if (token) {
        const userRes = await fetch(`${process.env.API_URL}/my-profile`, {
            headers: {
                token: token
            }
        })
        const plansRes = await fetch(`${process.env.API_URL}/plans`,)
        const user = await userRes.json()
        const plans = await plansRes.json()
        return {
            props: {
                userData: user,
                token: token,
                plans: plans.plans
            },
        };
    } else {
        return {
            props: {
                userData: null,
                token: null,
                plans: null
            },
        };
    }
}
export default Upgrade;