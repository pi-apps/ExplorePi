'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay,faCircle,faRightLong,faLeftLong } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

export default function Payment({lang}){
    const [status,setstatus] = useState(true)
    const runStream = () =>{
        setstatus(!status)
    }
    return(
        <>
            <div className="w-full grid grid-cols-1 divide-y">
                <div className="h-9 flex justify-around px-5 my-2">
                    <button className="h-full rounded aspect-square bg-indigo-400 " onClick={runStream}>
                        {status ? <FontAwesomeIcon icon={faCircle} className='text-[#d62246]' beat/>:<FontAwesomeIcon className=" text-[#ffdc5e]" icon={faPlay} />}
                        
                    </button>
                    {status ? 
                    <button className="h-full rounded aspect-square bg-slate-400 " disabled>
                        <FontAwesomeIcon icon={faLeftLong} className='text-[#1c1d4d]'/>
                    </button>:
                    <button className="h-full rounded aspect-square bg-[#f0a202] ">
                        <FontAwesomeIcon icon={faLeftLong} className='text-[#1c1d4d]'/>
                    </button>}

                    {status ?
                    <button className="h-full rounded aspect-square bg-slate-400" disabled>
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>:
                    <button className="h-full rounded aspect-square bg-[#f0a202] ">
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>
                    }
                </div>
                {Array(10).fill(true).map((_, i) => 
                <div className=" h-9 bg-slate-200 rounded my-1 animate-pulse" key={i}>
                    
                </div>)}
            </div>
        </>
    )
}