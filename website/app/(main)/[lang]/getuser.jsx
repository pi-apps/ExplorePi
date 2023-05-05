'use client'

import { useEffect, useState } from "react"

export default function GetUser({pibrowser}){
    const [pi,setpi]= useState(false)
    useEffect(()=>{
        setpi(window.navigator.userAgent.toLowerCase().includes("pibrowser"))
    })
    
    if(pi){
        return(pibrowser)
    }
}