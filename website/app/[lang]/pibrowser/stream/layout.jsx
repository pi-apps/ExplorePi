'use client'

import { Button } from "flowbite-react"
import { useState } from "react"

export default function StreamLayout({children}){
    const [start, setstart] = useState(false)
    const handleClick = () =>{
        setstart(true)
    }
    if(!start){
        return(
            <>
            <div className="">
                
            </div>
            <div className="flex justify-center items-center h-full">
                <Button onClick={handleClick} gradientDuoTone="purpleToBlue" className="w-full mx-24" pill={true}>Start</Button>
            </div>
            </>
        )
    }else{
        return(children)
    }
    
}