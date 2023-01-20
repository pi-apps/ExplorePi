'use client'
import getago from "lib/time";
import { useEffect, useState } from "react";
import { Server } from "stellar-sdk";
import TableLoading from "./tableloading";

export default function Payment({transcript,time}){
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [payment,setpayment] = useState(null)
    useEffect(()=>{
        server.payments()
        .cursor('now')
        .order('desc')
        .limit(10)
        .call().then( res => {
            setpayment(res.records)
            console.log(res)
        })
    },[])
    return(
        <>
        <table className='table-fixed w-full text-center font-mono'>
            <thead className="border-b border-slate-400 text-lg">
                <tr>
                    <th>{transcript.From}</th>
                    <th>{transcript.To}</th>
                    <th>{transcript.Amount}</th>
                    <th>{transcript.Time}</th>
                </tr>
            </thead>
            <tbody>
                {payment===null ?  <TableLoading/>:payment.map((data,index)=>{
                    let date = new Date(data.closed_at)
                    let from_account = typeof data.from === 'string' ? data.from.substring(0,4) : '';
                    let to_account = typeof data.to === 'string' ? data.to.substring(0,4) : '';
                    if(data.type_i!=1) return
                    return(
                        <tr key={index} className='border-b border-slate-300 text-lg'>
                            <td>{from_account}</td>
                            <td>{to_account}</td>
                            <td className=" text-sm">{parseFloat(data.amount)} Pi</td>
                            <td>{getago(data.created_at,time)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}