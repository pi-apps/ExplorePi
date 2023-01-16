'use client'
import { useEffect, useState } from "react";
import { Server } from "stellar-sdk";
import TableLoading from "./tableloading";

export default function Transaction({transcript}){
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
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
                    let date = new Date(data.closed_at)
                    let tx_hash = typeof data.hash === 'string' ? data.hash.substring(0,8) : '';
                    return(
                        <tr key={index} className='border-b border-slate-300 text-lg'>
                            <td>{tx_hash}</td>
                            <td>{data.operation_count}</td>
                            <td></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}