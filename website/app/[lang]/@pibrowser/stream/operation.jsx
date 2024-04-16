'use client'
import { formatTrans } from "lib/translate"
import { useEffect, useState } from "react"
import { Horizon } from "stellar-sdk"
import getago from "lib/time"
import Link from "next/link"
export default function Operation({status,account,transcript,time,lang}){
    const [run,setrun] = useState(false)
    const [data,setdata]=useState([])
    const [stream,setstream]=useState()
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    useEffect(()=>{

        if(status){
            setdata([])
            if(account.match(/^G[A-Za-z0-9]{55}/)){
                setrun(true)
                setstream(()=>server.operations()
                .forAccount(account)
                .cursor('now')
                .stream({
                    onmessage: (res)=>{                       
                        setdata(predata=>([res, ...predata]))
                    }
                })
                )
            }else{
                setrun(true)
                setstream(()=>server.operations()
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
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                {transcript.source}
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                {transcript.operation}
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                {transcript.detail}
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                {transcript.time}
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            
                                data!=null &&　data.map((data,index)=>{
                                    return(categoryoperation(data,transcript,time,index,lang))
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
function categoryoperation(data,transcript,time,index,lang){
    let detail,value,type
    
    switch (data.type) {
        case 'create_account':
            type = transcript.type.create_account
            value={
                a:data.funder.substring(0,4),
                b:data.account.substring(0,4),
                amount:parseFloat(data.starting_balance)
            }
            detail = formatTrans(transcript.create_account,value)
            break;
        case 'payment':
            type = transcript.type.payment
            value={
                a:data.from.substring(0,4),
                b:data.to.substring(0,4),
                amount:parseFloat(data.amount)
            }
            detail = formatTrans(transcript.payment,value)
            break;
        case 'create_claimable_balance':
            type = transcript.type.create_claimable_balance
            value={
                a:data.sponsor.substring(0,4),
                b:data.claimants[1].destination.substring(0,4),
                amount:parseFloat(data.amount)
            }
            detail = formatTrans(transcript.create_claimable_balance,value)
            break;
        case 'claim_claimable_balance':
            type = transcript.type.claim_claimable_balance
            value={
                a:data.source_account.substring(0,4)
            }
            detail = formatTrans(transcript.claim_claimable_balance,value)
            break;
        default:
            break;
    }
    return (
        <tr key={index} className="bg-white border-b">
        <td className="px-2 py-4 text-sm font-medium text-gray-900">
            <Link href={`/${lang}/account/${data.source_account}`}>
                <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-purple-400 text-white rounded-full">
                {data.source_account.substring(0,4)}
                </span>
            </Link>
        </td>
        <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
            {type}
        </td>
        <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
            {detail}
        </td>
        <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
        {getago(data.created_at,time)}
        </td>
        </tr> 
    )
}