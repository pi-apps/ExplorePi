'use client'
import { Button } from "flowbite-react"
import { useState } from "react"
import { Rowdies } from "@next/font/google"

const rowdie = Rowdies({
    weight:'700'
})
export default function StartButton(children){
    const [start, setstart] = useState(false)
    const handleClick = () =>{
        setstart(true)
    }
    if(!start){
        return(
            <>
            <div className="flex justify-center items-center h-full">
                <div className="block w-full ">
                    <div className={`${rowdie.className} text-center text-3xl top-1`}>
                        Streaming
                    </div>
                    <div className="font-mono text-center text">
                        <div className="text-xl underline">
                            What is Streaming?
                        </div>
                        
                    </div>
                    <Button onClick={handleClick} gradientDuoTone="purpleToBlue" className="w-52 m-auto" pill={true}>Start</Button>
                </div>
            </div>
            </>
        )
    }else{
        return(children)
    }
}