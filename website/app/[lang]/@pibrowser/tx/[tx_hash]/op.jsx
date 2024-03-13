'use client'
import { useEffect, useState } from "react"
import { formatTrans } from "lib/translate"
import { Horizon } from "stellar-sdk"
import Link from "next/link"
export default function Operation({lang,tx_hash,transcript}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [data,setdata] = useState(null)
    useEffect(()=>{
        server.operations()
        .forTransaction(tx_hash)
        .call().then( res => {
            setdata(res.records)
        })
    },[tx_hash])

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
            {transcript.no}
        </div>
        </>
    )

    return(
        <>
            <table className="w-full text-center table-fixed font-mono">
                <thead className="border-b border-slate-400 text-lg">
                    <tr>
                        <th>{transcript.account}</th>
                        <th>{transcript.operation}</th>
                        <th>{transcript.detail}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((data,index)=>{
                            return(categoryoperation(data,transcript,index,lang))
                        })
                    }
                    
                </tbody>
            </table>
        </>
    )
}
function categoryoperation(data,transcript,index,lang){
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
        <td className="py-2 text-md font-medium text-gray-900">
            <Link href={`/${lang}/account/${data.source_account}`}>
                <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-purple-400 text-white rounded-full">
                {data.source_account.substring(0,4)}
                </span>
            </Link>
        </td>
        <td className="text-md text-gray-900 font-light py-2 break-words">
            {type}
        </td>
        <td className="text-md text-gray-900 font-light py-2 break-words">
            {detail}
        </td>
        </tr> 
    )
}