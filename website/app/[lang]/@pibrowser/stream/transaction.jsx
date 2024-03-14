'use client'
import { useEffect, useState } from "react"
import {  Horizon } from "stellar-sdk"
import getago from "lib/time"
import Link from "next/link"
export default function Transaction({status,account,transcript,time,lang}){
    const [run,setrun] = useState(false)
    const [data,setdata]=useState([])
    const [stream,setstream]=useState()
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])

    useEffect(()=>{

        if(status){
            setdata([])
            if(account.match(/^G[A-Za-z0-9]{55}/)){
                setrun(true)
                setstream(()=>server.transactions()
                .forAccount(account)
                .cursor('now')
                .stream({
                    onmessage: (res)=>{     
                        if(res.type==="payment")                  
                        setdata(predata=>([res, ...predata]))
                    }
                })
                )
            }else{
                setrun(true)
                setstream(()=>server.transactions()
                .cursor('now')
                .stream({
                    onmessage: (res)=>{         
                        setdata(predata=>([res, ...predata]))                        
                    }
                })
                )
            }
            

        }else{
            if(!run) return
            setrun(false)
            stream()
        }
    },[status])
    return(
        <>
        <div className="w-full">
            <div className="block w-full">
                <div className="overflow-hidden">
                    <table className="w-full text-center table-auto">
                        <thead className="border-b bg-gray-50 w-full">
                            <tr>
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.Hash}</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.Operation}</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.Time}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            
                                data!=null && data.map((data,index)=>{
                                    let tx_hash = typeof data.hash === 'string' ? data.hash.substring(0,8) : '';
                                    return(
                                        <tr key={index} className="bg-white border-b">
                                            <td className="px-2 py-4 text-sm font-medium text-gray-900">
                                            <Link href={`/${lang}/tx/${data.hash}`}>
                                                <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-400 text-white rounded-full">
                                                {tx_hash}
                                                </span>
                                            </Link>
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
                                            {data.operation_count}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
                                            {getago(data.created_at,time)}
                                            </td>
                                        </tr> 
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
        </>
    )
}