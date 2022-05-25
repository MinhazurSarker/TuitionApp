import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SideNav from '../components/SideNav'
// import {UserAuthContext} from '../contexts/UserContext'
import { useEffect, useState, createContext } from 'react';
import Router from "next/router";
import NProgress from "nprogress";
import { destroyCookie, parseCookies } from 'nookies';
import Cookies from 'js-cookie'

export const AppContext = createContext({ user: null, token: null, setUser: null, setToken: null });



function MyApp({ Component, pageProps }) {

  const [user, setUser] = useState(null)
  const [token, setToken] = useState(Cookies.get('authToken'))

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user')) 
    if (user == null) {
      setUser(localUser)
    }
    if (token == null) {
      setToken(Cookies.get('authToken'))
    }

  }, []);

  
  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on("routeChangeStart", handleRouteStart);
    Router.events.on("routeChangeComplete", handleRouteDone);
    Router.events.on("routeChangeError", handleRouteDone);
    return () => {
      Router.events.off("routeChangeStart", handleRouteStart);
      Router.events.off("routeChangeComplete", handleRouteDone);
      Router.events.off("routeChangeError", handleRouteDone);
    };
  }, []);




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
  console.clear()
  return (
    <AppContext.Provider value={{ user, setUser, token, setToken }}>
      <div className={`${darkmode ? 'dark' : ''}`}>
        <div className=' bg-slate-200 dark:bg-slate-900'>
          <Header updateMobileMenuState={updateMobileMenuState} darkmode={darkmode} mobileMenuShow={mobileMenuShow} />
          <div className='flex flex-row'>
            <SideNav darkmode={darkmode} darkModeHandler={darkModeHandler} updateMobileMenuState={updateMobileMenuState} mobileMenuShow={mobileMenuShow} />
            <div className='container'>
              <Component {...pageProps} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default MyApp
