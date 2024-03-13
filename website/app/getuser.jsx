'use client'

import { useState, createContext, useEffect } from "react"
import Script from "next/script"
import Home from "./loadingpi"


export const BrowserContext = createContext()

export default function GetUser({children}){
    const [pimode,setpimode] = useState(null)
    const [piglobal,setpiglobal] = useState(null)
    useEffect(() => {
        if (
          window.location.ancestorOrigins[0] == "https://sandbox.minepi.com" ||
          window.location.ancestorOrigins[0] == "https://app-cdn.minepi.com"
        ) {
            setpimode(true);
        } else {
            setpimode(false);
        }
      }, []);
    const piinit = () =>{
        
        const scopes = ['payments','username'];
        function onIncompletePaymentFound(payment) { /* ... */ };
        Pi.init({ version: "2.0",sandbox:process.env['NEXT_PUBLIC_SANDBOX']=='true'?true:false }).catch(
        )
        console.log(Pi);
        setpiglobal(Pi)
        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
            
            setpimode(auth)
          }).catch(function(error) {
            console.error('error');
          });
    }
    if(!pimode){
        return(
                <BrowserContext.Provider value={{pimode,pi:piglobal}}>
                {children}
                </BrowserContext.Provider>            

        )
    }else if(pimode){
        return(
            <>
                <Script src="https://sdk.minepi.com/pi-sdk.js" onLoad={piinit}/>
                <BrowserContext.Provider value={{pimode:pimode,pi:piglobal}}>
                {children}
                </BrowserContext.Provider>            
            </>
        )
    }else{
        return <Home/>
    }
    
}
