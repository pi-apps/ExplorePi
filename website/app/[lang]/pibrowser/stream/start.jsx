'use client'
import { Button } from "flowbite-react"
import { useState } from "react"
import { Rowdies } from "@next/font/google"
import { Hind_Siliguri } from "@next/font/google"

const hind = Hind_Siliguri({
    subsets: ['latin'],
    weight:'500'
})
const rowdie = Rowdies({
    subsets: ['latin'],
    weight:'700'
})
export default function StartButton({children}){
    const [start, setstart] = useState(false)
    const handleClick = () =>{
        setstart(true)
    }
    if(!start){
        return(
            <>
            <div className="flex justify-center items-center h-full">
                <div className="block w-full ">
                    <div className={`${rowdie.className} text-center text-3xl mb-8`}>
                        Streaming
                    </div>
                    <div className="font-mono text-center text">
                        <div className="text-xl underline">
                            What is Streaming?
                        </div>
                        <div className={`text-md ${hind.className} mx-4 text-lg mb-3`}>
                            Stream is a feature on Stellar Horizon. Horizon provides a streaming mechanism for receiving events in near real time.
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