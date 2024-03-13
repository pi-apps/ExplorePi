'use client'
import getago from "lib/time";
import { useEffect, useState } from "react";
import { Horizon } from "stellar-sdk";
import TableLoading from "./tableloading";
import Link from "next/link";

export default function Transaction({transcript,time,lang}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [transaction,settransaction] = useState(null)
    useEffect(()=>{
        server.transactions()
        .cursor('now')
        .order('desc')
        .call().then( res => {
            settransaction(res.records)
            console.log(res)
        })
    },[])
    return(
        <>
        <table className='table-fixed w-full text-center font-mono'>
            <thead className="border-b border-slate-400 text-lg">
                <tr>
                    <th>{transcript.Hash}</th>
                    <th>{transcript.Operation}</th>
                    <th>{transcript.Time}</th>
                </tr>
            </thead>
            <tbody>
                {transaction===null ?  <TableLoading/>:transaction.map((data,index)=>{
                    let tx_hash = typeof data.hash === 'string' ? data.hash.substring(0,8) : '';
                    return(
                        <tr key={index} className='border-b border-slate-300 text-lg'>
                            <td className="py-2">
                                <Link href={`./tx/${data.hash}`}>
                                    <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-400 text-white rounded-full">
                                    {tx_hash}
                                    </span>
                                </Link>
                            </td>
                            <td className="py-2">{data.operation_count}</td>
                            <td className="py-2">{getago(data.created_at,time)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}