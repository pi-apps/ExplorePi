'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {  useContext } from "react"
import { BrowserContext } from "app/getuser"

export default function Piapp({lang}){
    const router = useRouter()
    const pimode = useContext(BrowserContext)
    if(pimode!==null)
    router.push('./explorer')
    return(
        <>
        
        </>
    )
}