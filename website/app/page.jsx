'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Home from "./loadingpi"

export default function Piapp({lang}){
    const router = useRouter()
    useEffect(()=>{
        router.push('./explorer')
        
    },[])
    return(
        <>
        </>
    )
}