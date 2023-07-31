'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Home from "./loading"

export default function Piapp({lang}){
    const router = useRouter()
    useEffect(()=>{
        router.push(`/explorer`)
    },[])
    
      
    return(
        <>
        <Home/>
        </>
    )
}