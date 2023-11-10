'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay,faCircle,faRightLong,faLeftLong, faListCheck } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import Script from "next/script"
import getago from "lib/time"

export default function Block({lang,time}){
    const [status,setstatus] = useState(true)
    const [stream,setstream] = useState()
    const [data,setdata] = useState([])
    const [blockpage,setblockpage] = useState(0)
    const [server,setserver] = useState()
    const runStream = () =>{
        if(stream && status){
            setstatus(!status)
            stream()
        }else{
            setdata([])
            setstatus(!status)
            setblockpage(0)
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

    const prepage = () =>{
        if(blockpage===0) return
        setblockpage(blockpage - 10)
    }
    const nextpage = () =>{
        if(blockpage + 10 >= data.length) return
        setblockpage(blockpage + 10) 
    }

    const streamStart = () =>{
        setserver(new StellarSdk.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER']))
    }
    useEffect(()=>{
        if(status && server){
            setstream(()=>server.ledgers()
            .cursor('now')
            .stream({
                onmessage: (res)=>{                     
                    setdata(predata=>([res, ...predata]))
                    
                }
            })
            )
        }
    },[server])
    useEffect(()=>{

    },[blockpage])
    return(
        <>
            <Script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.4.1/stellar-sdk.js" onLoad={streamStart}></Script>
            <div className="w-full h-full flex flex-col divide-y">
                <div className=" flex-initial h-9 flex justify-around px-5 my-2">
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
                    {status ? '':blockpage/10+1}
                    {status ?
                    <button className="h-full rounded aspect-square bg-slate-400" disabled>
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>:
                    <button className="h-full rounded aspect-square bg-[#f0a202]" onClick={nextpage}>
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>
                    }
                </div>
                <div className="overflow-scroll py-5">
                {Array.isArray(data) && data.length > 0 ? 
                data.slice(blockpage,blockpage+10).map(record => {
                    let block_hash = typeof record.hash === 'string' ? record.hash.substring(0,4)+'...'+record.hash.substring(record.hash.length - 4) : '';
                    const success =  record.successful_transaction_count/record.max_tx_set_size
                    const failed = success + (record.failed_transaction_count/record.max_tx_set_size)
                    return(
                    <div className="h-20 py-2 flex gap-x-1 justify-around items-center" key={record.sequence}>
                        <div className="flex-none">
                            <div className="w-9 h-9 flex justify-center items-center rounded bg-[#e0c3fc]">
                                <FontAwesomeIcon icon={faListCheck}/>
                            </div>                            
                        </div>
                        <div className='flex-none w-16'>
                                <div>{record.sequence}</div>
                                <div>{block_hash}</div>
                        </div>
                        <div className='flex-initial block w-56 pl-6'>
                            <div className=" bg-black relative h-1 w-full rounded-2xl bottom-0">
                                <div className={` bg-lime-400 absolute top-0 z-10 left-0 h-full w-[${success}%] rounded-2xl`}>
                                    <span className='bg-lime-400 absolute -right-4 bottom-full mb-2 rounded-sm py-1 px-2 text-xs font-semibold text-white'>
                                        <span className='bg-lime-400 absolute bottom-[-2px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm'></span>
                                    {record.successful_transaction_count}
                                    </span>
                                </div>
                                <div className={` bg-red-600 absolute bottom-0 left-0 h-full w-[${failed}%] rounded-2xl`}>
                                    <span className='bg-red-600 absolute -right-4 top-full mt-2 rounded py-1 px-2 text-xs font-semibold text-white'>
                                        <span className='bg-red-600 absolute top-[-2px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm'></span>
                                    {record.failed_transaction_count}
                                    </span>
                                </div>
                                <div className="absolute right-0">
                                    {record.max_tx_set_size}
                                </div>
                            </div>
                        </div>
                        <div className="flex-initial w-20">{getago(record.closed_at,time)}</div>
                    </div>
                    )
                })
                :
                Array(10).fill(true).map((_, i) =>
                <div className=" h-20 py-2 " key={i}>
                    <div className="bg-slate-200 rounded animate-pulse h-full">

                    </div>
                </div>)
                }
                </div>
            </div>
        </>
    )
}