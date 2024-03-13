'use client'
import getago from "lib/time";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Horizon } from "stellar-sdk";
import TableLoading from "./tableloading";

export default function Block({lang,transcript,time}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [block10,setblock10] = useState(null)
    useEffect(()=>{
        server.ledgers()
        .cursor('now')
        .order('desc')
        .call().then( res => {
            setblock10(res.records)
            console.log(res)
        })
    },[])
    return(
        <>
        <table className='table-fixed w-full text-center font-mono'>
            <thead className="border-b border-slate-400 text-lg">
                <tr>
                    <th>{transcript.Block}</th>
                    <th>{transcript.Transactions}</th>
                    <th>{transcript.Time}</th>
                </tr>
            </thead>
            <tbody>
                {block10===null ?  <TableLoading/>:block10.map((data,index)=>{
                    let date = new Date(data.closed_at)
                    return(
                        <tr key={index} className='border-b border-slate-300 text-lg'>
                            <td className="py-2">
                                <Link href={`./block/${data.sequence}`}>
                                    <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-400 text-white rounded-full">
                                    {data.sequence}
                                    </span>
                                </Link>
                            </td>
                            <td className="py-2">{data.successful_transaction_count}</td>
                            <td className="py-2">{getago(data.closed_at,time)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}