function InboxConversationCard() {
    return (
        <div className="flex my-2 w-full p-2 rounded-lg flex-col sm:flex-row bg-white dark:bg-slate-800 transition-all duration-150 hover:bg-slate-200 dark:hover:bg-slate-700 items-center gap-2 md:gap-4 cursor-pointer">
            <div className="w-8 h-8 bg-gray-100  rounded-full overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1532073150508-0c1df022bdd1?auto=format&q=75&fit=crop&w=256" loading="lazy" alt="Photo by christian ferrer" className="w-full h-full object-cover object-center" />
            </div>
            <div>
                <div className="text-indigo-500 md:text-lg font-bold text-center sm:text-left">Kate Berg</div>
            </div>
        </div>

    );
}



export default InboxConversationCard;