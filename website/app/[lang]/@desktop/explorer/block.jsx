'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay,faCircle,faRightLong,faLeftLong, faListCheck } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import Script from "next/script"
import getago from "lib/time"

export default function Block({lang,time}){
    const [status,setstatus] = useState(true)
    const [stream,setstream] = useState()
    const [data,setdata] = useState([])
    const [blockpage,setblockpage] = useState(0)
    const runStream = () =>{
        setstatus(!status)
        stream()
    }

    const prepage = () =>{
        if(blockpage===0) return
        setblockpage(blockpage - 10)
    }
    const nextpage = () =>{
        if(blockpage + 10 >= data.length) return
        setblockpage(blockpage + 10) 
    }

    const streamStart = () =>{
        const server =new StellarSdk.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
        if(status && server && 0){
            setstream(()=>server.ledgers()
            .cursor('now')
            .stream({
                onmessage: (res)=>{                     
                    setdata(predata=>([res, ...predata]))
                    
                }
            })
            )
        }
    }
    return(
        <>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.4.1/stellar-sdk.js" onLoad={streamStart}></Script>
            <div className="w-full grid grid-cols-1 divide-y">
                <div className="h-9 flex justify-around px-5 my-2">
                    <button className="h-full rounded aspect-square bg-indigo-400 " onClick={runStream}>
                        {status ? <FontAwesomeIcon icon={faCircle} className='text-[#d62246]' beat/>:<FontAwesomeIcon className=" text-[#ffdc5e]" icon={faPlay} />}
                        
                    </button>
                    {status ? 
                    <button className="h-full rounded aspect-square bg-slate-400 " disabled>
                        <FontAwesomeIcon icon={faLeftLong} className='text-[#1c1d4d]'/>
                    </button>:
                    <button className="h-full rounded aspect-square bg-[#f0a202] " onClick={prepage}>
                        <FontAwesomeIcon icon={faLeftLong} className='text-[#1c1d4d]'/>
                    </button>}

                    {status ?
                    <button className="h-full rounded aspect-square bg-slate-400" disabled>
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>:
                    <button className="h-full rounded aspect-square bg-[#f0a202]" onClick={nextpage}>
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>
                    }
                </div>
                {Array.isArray(data) && data.length > 0 ? 
                data.slice(blockpage,blockpage+10).map(record => {
                    let block_hash = typeof record.hash === 'string' ? record.hash.substring(0,4)+'...'+record.hash.substring(record.hash.length - 4) : '';
                    console.log(record)
                    return(
                    <div className="h-15 py-1 grid grid-cols-12 gap-1 justify-around items-center" key={record.sequence}>
                        <div className="col-span-2">
                            <div className="w-9 h-9 flex justify-center items-center rounded bg-[#e0c3fc]">
                                <FontAwesomeIcon icon={faListCheck}/>
                            </div>                            
                        </div>
                        <div className=' col-span-1'>
                                    <div>{record.sequence}</div>
                                    <div>{block_hash}</div>
                            </div>
                        <div className='col-span-6 block'>

                        </div>
                        <div className="col-span-3">{getago(record.closed_at,time)}</div>
                    </div>
                    )
                })
                :
                Array(10).fill(true).map((_, i) =>
                <div className=" h-15 py-1 " key={i}>
                    <div className="bg-slate-200 rounded my-1 animate-pulse h-9">

                    </div>
                </div>)
                }
                
            </div>
        </>
    )
}