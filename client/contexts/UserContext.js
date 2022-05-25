import {createContext , useEffect, useState} from 'react'

export const UserAuthContext = createContext(null);
function UserAuthProvider({children}) {
    const [user,setUser]=useState(null)
    const [token,setToken]=useState('')
    useEffect(() => {
        let user=localStorage.getItem('user')
        let token=localStorage.getItem('token')
        setUser(user)
        setToken(token)
    }, []);

    return (
        <UserAuthContext.Provider value={{user,setUser,token,setToken}}>
            {children}
        </UserAuthContext.Provider>
    );
}

export default UserAuthProvider;