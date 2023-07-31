'use client'
import { createContext, useEffect, useState } from "react"
import Home from "../loading"

export const BrowserContext = createContext()

export default function GetUser({pibrowser,desktop,params:{lang}}){
    const [pi,setpi]= useState(undefined)
    const [counter, setCounter] = useState(0);
    useEffect(()=>{
        setpi(window.navigator.userAgent.toLowerCase().includes("pibrowser"))
    })
    useEffect(() => {
        counter == 0 && setTimeout(() => setCounter(counter + 1), 1000);
        console.log(counter)
      }, [counter]);
    
    return(
        <>
            <BrowserContext.Provider value={pi}>
                {pi === undefined && <Home/>}
                {pi !== undefined && pi ? pibrowser : desktop} 
            </BrowserContext.Provider>
        </>
    )
}