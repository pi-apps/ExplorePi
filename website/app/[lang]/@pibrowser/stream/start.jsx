'use client'

import { useState } from "react"
import { Rowdies } from "next/font/google"
import { Hind_Siliguri } from "next/font/google"
import { Button } from "@nextui-org/react"


const hind = Hind_Siliguri({
    subsets: ['latin'],
    weight:'500'
})
const rowdie = Rowdies({
    subsets: ['latin'],
    weight:'700'
})
export default function StartButton({children,transcript}){
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
                        {transcript.title}
                    </div>
                    <div className="font-mono text-center text">
                        <div className="text-xl underline">
                            {transcript.q1}
                        </div>
                        <div className={`text-md ${hind.className} mx-4 text-lg mb-3`}>
                            {transcript.answer}
                        </div>
                    </div>
                    <div className=" justify-center flex">
                    <Button onClick={handleClick} className=" w-52 !m-auto rounded-full bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl">{transcript.button}</Button>
                    </div>
                    
                </div>
            </div>
            </>
        )
    }else{
        return(children)
    }
}