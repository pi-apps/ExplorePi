'use client'

import { useEffect, useState } from "react"
import Home from "./loading"

export default function GetUser({pibrowser,desktop,lang}){
    const [pi,setpi]= useState(undefined)
    const [counter, setCounter] = useState(0);
    useEffect(()=>{
        setpi(window.navigator.userAgent.toLowerCase().includes("pibrowser"))
    })
    useEffect(() => {
        counter == 0 && setTimeout(() => setCounter(counter + 1), 1000);
        console.log(counter)
      }, [counter]);
    
    if(pi){
        return(pibrowser)
    }else if(pi===undefined){
        return(
            <Home/>
        )
    }else{
        return(desktop)
    }
}