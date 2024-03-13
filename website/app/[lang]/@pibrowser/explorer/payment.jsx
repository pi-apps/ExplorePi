'use client'
import getago from "lib/time";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Horizon } from "stellar-sdk";
import TableLoading from "./tableloading";

export default function Payment({transcript,time,lang}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
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
                    let from_account = typeof data.from === 'string' ? data.from.substring(0,4) : '';
                    let to_account = typeof data.to === 'string' ? data.to.substring(0,4) : '';
                    if(data.type_i!=1) return
                    return(
                        <tr key={index} className='border-b border-slate-300 text-lg'>
                            <td className="py-2">
                                <Link href={`./account/${data.from}`}>
                                    <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-purple-400 text-white rounded-full">
                                    {from_account}
                                    </span>
                                </Link>
                            </td>
                            <td className="py-2">
                                <Link href={`./account/${data.to}`}>
                                    <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-yellow-300 text-white rounded-full">
                                    {to_account}
                                    </span>
                                </Link>
                            </td>
                            <td className="py-2 break-words">{parseFloat(data.amount)} Pi</td>
                            <td className="py-2">{getago(data.created_at,time)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
        </>
    )
}