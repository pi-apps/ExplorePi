'use client'
import { Server } from "stellar-sdk"
import { useEffect } from "react"
export default function AccountPage({params}){
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    useEffect(()=>{
        server.accounts()
        .accountId(params.account)
        .cursor('now')
        .order('desc')
        .call().then( res => {
            console.log(res)
        })
    },[])

    return(
        <>
        
        </>
    )
}