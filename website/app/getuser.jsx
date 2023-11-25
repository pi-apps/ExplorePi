'use client'

import { useState, createContext } from "react"
import Script from "next/script"


export const BrowserContext = createContext()

export default function GetUser({children}){
    const [pimode,setpimode] = useState(null)
    const [piglobal,setpiglobal] = useState(null)
    const PiError = () =>{
        setpimode(0)
    }
    const browsercode = () =>{
        if(pimode===0)return
        setpimode(0)
        return
    }
    const piinit = () =>{
        
        const scopes = ['payments','username'];
        function onIncompletePaymentFound(payment) { /* ... */ };
        Pi.init({ version: "2.0",sandbox:process.env['NEXT_PUBLIC_SANDBOX']=='true'?true:false }).catch(
            browsercode()
        )
        console.log(Pi);
        setpiglobal(Pi)
        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
            
            setpimode(auth)
          }).catch(function(error) {
            console.error('error');
          });
    }
    return(
        <>
            <Script src="https://sdk.minepi.com/pi-sdk.js" onLoad={piinit} onError={PiError}/>
            <BrowserContext.Provider value={{pimode:pimode,pi:piglobal}}>
            {children}
            </BrowserContext.Provider>            
        </>
    )
}
