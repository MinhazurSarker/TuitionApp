
import React, { useEffect, useState } from "react";
import head from 'next/head'

import styles from '../styles/Home.module.css'

import HomeTutorSection from '../components/HomeTutorSection'

import HomePostSection from '../components/HomePostSection'
import HomeHero from '../components/HomeHero'
import HomeStatus from '../components/HomeStatus'
import Sidebar from '../components/Sidebar'
import HomeSlider from '../components/HomeSlider';
import { parseCookies } from 'nookies';


export default function Home({token}) {
  const[start,setStart]=useState(true)
  useEffect(() => {
    setStart(!start)
    return () => {
    };
  }, []);
  return (
    <>
      <head>
        <title>TuitionApp - Find tutor, Learn anything</title>
      </head>
      <div className='flex 2xl:flex-row  xl:flex-row  lg:flex-row md:flex-col sm:flex-col flex-col '>
        <div className="2xl:basis-9/12 xl:basis-9/12 lg:basis-9/12 md:basis-full sm:basis-full basis-full h-full mb-8">
          <div className="max-w-screen-xl px-4 md:px-8 mx-auto">
            <HomeSlider/>
          </div>
          <div className="max-w-screen-xl mt-12 px-4 md:px-8 mx-auto">
            <HomeTutorSection token={token} />
          </div>
          <div className="max-w-screen-xl mt-12 px-4 md:px-8 mx-auto">
            <HomePostSection start={start}/>
          </div>
        </div>
        <div className="2xl:basis-3/12 xl:basis-3/12 lg:basis-3/12 md:basis-full sm:basis-full basis-full">
          <Sidebar />
        </div>
      </div>
      <div className="w-full my-8 px-12 md:px-8 mx-auto  lg:mb-8 md:mb-6 sm:mb-4 mb-2">
        < HomeHero />
      </div>
      <div className="w-full my-8 px-12 md:px-8 mx-auto  lg:mb-8 md:mb-6 sm:mb-4 mb-2">
        < HomeStatus />
      </div>

    </>
  )
}
export async function getServerSideProps(ctx) {
  let token = parseCookies(ctx).authToken || null;
  return {
      props: {
          token: token
      },
  };
}
