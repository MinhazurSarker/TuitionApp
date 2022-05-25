import Header from './Header'
import Footer from './Footer'
import SideNav from './SideNav'
import { useEffect, useState } from 'react';


function Layout({ children }) {
    const [mobileMenuShow, setMobileMenuShow] = useState(false);
    const [darkmode, setDarkmode] = useState(false);
    useEffect(() => {
        let themeDark;
        if (localStorage.getItem('theme') == 'dark') {
            themeDark = true
        } else {
            themeDark = false
        }
        setDarkmode(themeDark)
    }, []);

    const darkModeHandler = (darkModeState) => {
        setDarkmode(darkModeState)
    }
    const updateMobileMenuState = (menuState) => {
        setMobileMenuShow(menuState)
    }
    return (
        <div className={`${darkmode ? 'dark' : ''}`}>
            <div className=' bg-slate-100 dark:bg-slate-900'>
                <Header updateMobileMenuState={updateMobileMenuState} darkmode={darkmode} mobileMenuShow={mobileMenuShow} />
                <div className='flex flex-row'>

                    <SideNav darkmode={darkmode} darkModeHandler={darkModeHandler} updateMobileMenuState={updateMobileMenuState} mobileMenuShow={mobileMenuShow}/>

                    <div className='container'>
                        {children}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}



export default Layout;