import { useEffect, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import axios from 'axios'
import Link from "next/link";

function HomeSlider({ sliderData }) {
    const ServerRoot = process.env.NEXT_PUBLIC_BACKEND_URL
    const [slides, setSlides] = useState([])
    const [active, setActive] = useState(0)
    const [play, setPlay] = useState(true)

    const handlePrev = () => {
        if (active == 0) {
            setActive(slides.length - 1)
        } else {
            setActive(active - 1)
        }
    }
    const handleNext = () => {
        if (slides.length == active + 1) {
            setActive(0)
        } else {
            setActive(active + 1)
        }
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setPlay(!play);
            handleNext();

        }, 5000);
        return () => clearInterval(interval);
    }, [play]);

    useEffect(() => {
        setSlides(sliderData.slides)
    }, []);

    return (
        <section className=" w-full h-56 md:h-80 flex justify-center items-center flex-1 shrink-0 bg-indigo-500 overflow-hidden shadow-lg rounded-lg relative py-3 mb-12 ">
            <button onClick={handlePrev} className="h-full w-[15%] transition-colors duration-300 hover:bg-indigo-900/50 absolute top-0 left-0 z-10 hover:text-white text-indigo-500 flex items-center justify-center">
                <BiChevronLeft className='w-10 h-10' />
            </button>
            {slides.map((slide, index) => (
                <Link href={slide.url} passHref>
                    <div key={index} className={`transition-opacity duration-300 w-full h-full flex justify-center ${active === index ? ' opacity-100' : 'opacity-0'} absolute`}>
                        <img src={`${ServerRoot}${slide.img}`} loading="lazy" alt="Photo by Fakurian Design" className="w-full h-full object-cover object-center absolute inset-0" />
                        {(slide.heading.toString() !== '' || slide.text.toString() !== '') ?
                            <div className="bg-indigo-100/50 absolute inset-0"></div>
                            : ''
                        }
                        <div className="sm:max-w-xl flex items-center flex-col  relative p-4">
                            <h1 className="text-indigo-500 text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">{slide.heading}</h1>
                            <p className="text-indigo-500 text-lg sm:text-xl text-center mb-4 md:mb-8">{slide.text}</p>
                        </div>
                    </div>
                </Link>
            ))}
            <button onClick={handleNext} className="h-full w-[15%] transition-colors duration-300 hover:bg-indigo-900/50 absolute top-0 right-0 z-10 hover:text-white text-indigo-500 flex items-center justify-center">
                <BiChevronRight className='w-10 h-10' />
            </button>
        </section>
    );
}
export default HomeSlider;