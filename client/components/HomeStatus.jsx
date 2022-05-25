import { useEffect, useState, } from "react";

function HomeStatus() {
  const ApiServer = process.env.NEXT_PUBLIC_API_URL
  const [users, setUsers] = useState();
  const [tutors, setTutors] = useState();
  const [students, setStudents] = useState();
  const [posts, setPosts] = useState();
  useEffect(() => {
    fetchData()
    return () => {
    };
  }, []);

  async function fetchData() {
    await (await fetch(`${ApiServer}/stats`)).json().then(data => {
      setUsers(data.users);
      setTutors(data.tutors);
      setStudents(data.students);
      setPosts(data.posts);
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg py-6 sm:py-8 lg:py-12">
      <div className="max-w-screen-xl px-4 md:px-8 mx-auto">
        <div className="mb-8 md:mb-12">
          <h2 className="text-gray-800 dark:text-gray-200 text-2xl lg:text-3xl font-bold text-center mb-4 md:mb-6">Overview</h2>
          <p className="max-w-screen-md text-gray-500 md:text-lg text-center mx-auto">Get a short idea about us.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
          <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-4 lg:p-8">
            <div className="text-indigo-500 text-xl sm:text-2xl md:text-3xl font-bold">{students}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200 dark sm:text-base font-semibold">Students</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-4 md:p-8">
            <div className="text-indigo-500 text-xl sm:text-2xl md:text-3xl font-bold">{tutors}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200 sm:text-base font-semibold">Tutors</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-4 md:p-8">
            <div className="text-indigo-500 text-xl sm:text-2xl md:text-3xl font-bold">{users}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200 sm:text-base font-semibold">Total users</div>
          </div>
          <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-4 md:p-8">
            <div className="text-indigo-500 text-xl sm:text-2xl md:text-3xl font-bold">{posts}</div>
            <div className="text-sm text-gray-800 dark:text-gray-200 sm:text-base font-semibold">Tuition posts</div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default HomeStatus;