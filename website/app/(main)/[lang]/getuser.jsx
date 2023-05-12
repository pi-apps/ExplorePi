'use client'

import { useEffect, useState } from "react"
import DesktopLayout from "./desktop"

export default function GetUser({pibrowser,desktop,lang}){
    const [pi,setpi]= useState(false)
    useEffect(()=>{
        setpi(window.navigator.userAgent.toLowerCase().includes("pibrowser"))
    })
    
    if(pi){
        return(pibrowser)
    }else{
        return(
            <>
                <DesktopLayout lang={lang}>
                {desktop}
                </DesktopLayout>
            </>
        )
    }
}