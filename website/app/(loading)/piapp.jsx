'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Piapp({lang}){
    const router = useRouter()
    useEffect(()=>{
        window.setTimeout(( () => router.push(`./explorer`) ), 10000)
    })
      
    return(
        <>
        </>
    )
}