import { createContext, useState } from 'react'
export const UserContext = createContext({});

export function UserContextProvider({children}){
    const[userinfo,setUserInfo]= useState({})
    return(
        <UserContext.Provider value={{userinfo,setUserInfo}}>

        {children}
        </UserContext.Provider> 
    );
        
    
}
