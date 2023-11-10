'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlay,faCircle,faRightLong,faLeftLong, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { useEffect,useState } from "react"
import Script from "next/script"
import getago from "lib/time"

export default function Transaction({lang,time}){
    const [status,setstatus] = useState(true)
    const [data,setdata] = useState([])
    const [stream,setstream] = useState()
    const [txpage,settxpage] = useState(0)
    const runStream = () =>{
        setstatus(!status)
        stream()
    }
    const prepage = () =>{
        if(txpage===0) return
        settxpage(txpage - 10)
    }
    const nextpage = () =>{
        if(txpage + 10 >= data.length) return
        settxpage(txpage + 10) 
    }
    const streamStart = () =>{
        const server =new StellarSdk.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
        if(status && server){
            setstream(()=>server.transactions()
            .cursor('now')
            .stream({
                onmessage: (res)=>{                     
                    setdata(predata=>([res, ...predata]))
                    
                }
            })
            )
        }
    }
    useEffect(()=>{

    },[txpage])

    return(
        <>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/stellar-sdk/10.4.1/stellar-sdk.js" onLoad={streamStart}></Script>
            <div className="w-full grid grid-cols-1 divide-y ">
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
                    <button className="h-full rounded aspect-square bg-[#f0a202] " onClick={nextpage}>
                        <FontAwesomeIcon icon={faRightLong} className='text-[#1c1d4d]'/>
                    </button>
                    }
                </div>
                {Array.isArray(data) && data.length > 0 ? 
                data.slice(txpage,txpage+10).map(record => {
                    const source_account = record.source_account.substring(0,4)
                    let tx_hash = typeof record.hash === 'string' ? record.hash.substring(0,4)+'...'+record.hash.substring(record.hash.length - 4) : '';
                    console.log(record)
                    const success =  record.successful_transaction_count/record.max_tx_set_size
                    const failed = success + (record.failed_transaction_count/record.max_tx_set_size)
                    return(
                    <div className="h-20 py-1 grid grid-cols-6 gap-x-2 justify-around items-center" key={record.sequence}>
                        <div className="col-span-1">
                            <div className="w-9 h-9 flex justify-center items-center rounded bg-[#e0c3fc]">
                                <FontAwesomeIcon icon={faArrowRightArrowLeft}/>
                            </div>                            
                        </div>
                        <div className='col-span-1'>
                            <div>{source_account}</div>
                        </div>
                        <div className='col-span-1'>
                            <div>{tx_hash}</div>
                        </div>
                        <div className='flex-initial block w-56'>
                            
                        </div>
                        <div className="flex-initial w-20">{getago(record.closed_at,time)}</div>
                    </div>
                    )
                })
                :
                Array(10).fill(true).map((_, i) =>
                <div className=" h-20 py-1 " key={i}>
                    <div className="bg-slate-200 rounded my-1 animate-pulse h-16">

                    </div>
                </div>)
                }
                
            </div>
        </>
    )
}