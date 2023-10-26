'use client'
import {  useContext } from "react"
import { BrowserContext } from "app/getuser"


export default function GetUser({pibrowser,desktop,params:{lang}}){

    const pimode = useContext(BrowserContext)
    console.log('test '+pimode.pimode)
    return(
        <>
            {pimode.pimode===0 ?  desktop : pibrowser} 
        </>
    )
}