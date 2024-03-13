'use client'
import {  useContext, useEffect, useState } from "react"
import { BrowserContext } from "app/getuser"


export default function GetUser({pibrowser,desktop,params:{lang}}){
    const {pimode} = useContext(BrowserContext)

    return(
        <>
            {pimode ?  pibrowser : desktop} 
        </>
    )
}