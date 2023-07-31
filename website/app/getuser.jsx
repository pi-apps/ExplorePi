'use client'

import { useEffect, useState, createContext } from "react"
import Script from "next/script"

export const BrowserContext = createContext()

export default function GetUser({children}){
    const [pimode,setpi]= useState(undefined)
    const [counter, setCounter] = useState(0);
    useEffect(()=>{
        setpi(window.navigator.userAgent.toLowerCase().includes("pibrowser"))
    })
    useEffect(() => {
        counter == 0 && setTimeout(() => setCounter(counter + 1), 1000);
        console.log(counter)
      }, [counter]);

    const [auth,setauth] = useState(null)
    const piinit = () =>{
        const scopes = ['payments','username'];
        function onIncompletePaymentFound(payment) { /* ... */ };
        Pi.init({ version: "2.0",sandbox:false })
        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
            setauth(auth)
          }).catch(function(error) {
            console.error(error);
          });
    }
    return(
        <>
            <Script src="https://sdk.minepi.com/pi-sdk.js" onReady={piinit}/>
            <BrowserContext.Provider value={{pimode:pimode}}>
                {children}
            </BrowserContext.Provider>
        </>
    )
}