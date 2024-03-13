'use client'
import { useEffect, useState } from "react"
import { Horizon } from "stellar-sdk"
import Link from "next/link"
export default function Transaction({block,transcript,lang}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [data,setdata] = useState(null)
    useEffect(()=>{
        server.transactions()
        .forLedger(block)
        .call().then( res => {
            setdata(res.records)
        })
    },[block])
    useEffect(()=>{
        console.log(data)
    },[data])

    if(data===null)
    return(
        <>
        <div className="text-center">
        <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
            >Loading...</span>
        </div></div>
        </>
    )
    if(!data.length)
    return(
        <>
        <div className="text-center">
            There has no Transaction
        </div>
        </>
    )

    return(
        <>
            <table className="w-full text-center table-fixed font-mono">
                <thead className="border-b border-slate-400 text-lg">
                    <tr>
                        <th>{transcript.Hash}</th>
                        <th>{transcript.Operation}</th>
                        <th>{transcript.Account}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((record,index)=>{
                            return(
                            <tr key={index} className='border-b border-slate-300 text-lg'>
                                <td className="py-2">
                                    <Link href={`/${lang}/tx/${record.hash}`}>
                                        <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-400 text-white rounded-full">
                                        {record.hash.substring(0,8)}
                                        </span>
                                    </Link>
                                </td>
                                <td className="py-2">{record.operation_count}</td>
                                <td className="py-2">
                                    <Link href={`/${lang}/account/${record.source_account}`}>
                                    <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-purple-400 text-white rounded-full">
                                    {record.source_account.substring(0,4)}
                                    </span>
                                    </Link>
                                </td>
                            </tr>
                            )
                        })
                    }
                    
                </tbody>
            </table>
        </>
    )
}