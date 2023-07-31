'use client'
import { useRouter } from "next/navigation"

export default function Piapp({lang}){
    const router = useRouter()
    router.push(`./explorer`)
      
    return(
        <>
        </>
    )
}