
import Link from 'next/link';

function UserCard() {

    return (
        <Link href='/user/1'>
            <div className="flex flex-col items-center bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 lg:p-8 cursor-pointer">
                <div className="w-24 relative md:w-32 h-24 md:h-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-lg mb-2 md:mb-4">
                    <img src="https://images.unsplash.com/photo-1562904403-a5106bef8319?auto=format&q=75&fit=crop&w=256" loading="lazy" alt="" className="w-full h-full object-cover object-center" />
                </div>

                <div>
                    <div className="text-indigo-500 md:text-lg font-bold text-center">Ari Ferris

                    </div>
                    <p className="text-gray-600 dark:text-gray-200 text-sm md:text-base text-center mb-3 md:mb-4">Marketing Analyst</p>


                </div>
            </div>
        </Link>
    );
}


export default UserCard;