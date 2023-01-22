'use client'
import { formatTrans } from "lib/translate"
import { useEffect, useState } from "react"
import { Server } from "stellar-sdk"
import getago from "lib/time"
export default function Payment({status,account,transcript,time}){
    const [run,setrun] = useState(false)
    const [data,setdata]=useState([])
    const [stream,setstream]=useState()
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    useEffect(()=>{

        if(status){
            setdata([])
            if(account.match(/^G[A-Za-z0-9]{55}/)){
                setrun(true)
                setstream(()=>server.payments()
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
                setstream(()=>server.payments()
                .cursor('now')
                .stream({
                    onmessage: (res)=>{         
                        if(res.type==="payment")              
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
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.From}</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.To}</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.Amount}</th>
                                <th scope="col" className="text-sm font-medium text-gray-900 py-4">{transcript.Time}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            
                                data!=null && data.map((data,index)=>{
                                    let from_account = typeof data.from === 'string' ? data.from.substring(0,4) : '';
                                    let to_account = typeof data.to === 'string' ? data.to.substring(0,4) : '';
                                    return(
                                        <tr key={index} className="bg-white border-b">
                                            <td className="px-2 py-4 text-sm font-medium text-gray-900">
                                                {from_account}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
                                                {to_account}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-2 py-4 break-words">
                                            {parseFloat(data.amount)} Pi
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