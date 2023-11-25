'use client'
import {  useEffect, useState } from "react"
import Home from "app/loadingpi"


export default function GetUser({pibrowser,desktop,params:{lang}}){
    const [device,setdevice] = useState(null)
    useEffect(()=>{
        if(window.navigator.userAgent.toLowerCase().includes('pibrowser')){
            setdevice('pibrowser')
        }else{
            setdevice('desktop')
        }
    },[])

    return(
        <>
            {device == null ? <Home/> : device=='pibrowser' ?  pibrowser : desktop} 
        </>
    )
}