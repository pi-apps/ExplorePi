'use client'
import {  useContext } from "react"
import { BrowserContext } from "app/getuser"
import Home from "app/loadingpi"


export default function GetUser({pibrowser,desktop,params:{lang}}){

    const pimode = useContext(BrowserContext)
    console.log('test3 '+pimode.pimode)
    if(pimode.pimode==null)
    return <Home/>
    
    return(
        <>
            {pimode.pimode===0 ?  desktop : pibrowser} 
        </>
    )
}