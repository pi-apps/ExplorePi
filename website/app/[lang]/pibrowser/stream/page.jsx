'use client'
import { Server } from "stellar-sdk"

export default function StreamPage(){
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])

    return(
        <>
        </>
    )
}