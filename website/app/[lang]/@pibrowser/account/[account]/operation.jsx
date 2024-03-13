'use client'
import { Horizon } from "stellar-sdk"
import getago from "lib/time";
import { useEffect, useState } from "react"
import { formatTrans } from "lib/translate";
import { Button } from "flowbite-react";

export default function Operation({time,transcript,account}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [load,setload] = useState(null)
    const [data,setdata] = useState(null)

    useEffect(()=>{
        if(!account)return
        setload(null)
        setdata(null)

        server.operations()
        .forAccount(account)
        .order('desc')
        .call().then(res=>{
            setload(res)
            setdata(res.records)
        })
    },[account])
    
    function handleClick(){
        load.next().then(
            res=>{
                setdata([...data,...res.records])
            }
        )
    }
    return(
        <>
        <div className="w-full">
            <div className="block w-full">
                <div className="overflow-hidden">
                    <table className="w-full text-center table-auto">
                        <thead className="border-b bg-gray-50 w-full">
                            <tr>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                Source
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                Operation
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                Detail
                            </th>
                            <th scope="col" className="text-sm font-medium text-gray-900 py-4">
                                Time
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data!=null &&　data.map((data,index)=>{
                                    return(categoryoperation(data,transcript,time,index))
                                })
                            }
                        
                        </tbody>
                    </table>
                </div>
             </div>
            <div className="mt-2">
                {data != null && load.records.length >= 10 &&
                    <Button onClick={handleClick} gradientDuoTone="purpleToBlue" className="w-52 m-auto" pill={true}>Load More</Button>
                }   
            </div>
        </div>

        </>
    )
}

function categoryoperation(data,transcript,time,index){
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
        <td className="px-2 py-4 text-sm font-medium text-gray-900">{data.source_account.substring(0,4)}</td>
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