'use client'
import { useEffect, useState } from "react"
import { Horizon, Server } from "stellar-sdk"
import Link from "next/link"
export default function Dashboard({tx_hash,transcript,lang}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [data,setdata] = useState(null)
    useEffect(()=>{
        server.transactions()
        .transaction(tx_hash)
        .call().then( res => {
            setdata(res)
        })
    },[tx_hash])
    return(
        <>
        <div className="font-semibold mb-1 underline">
        UTC {data && data.created_at.substr(0,19).replace('T',' ')}
        </div>
        <div className=" rounded-xl overflow-hidden shadow-lg">   
            <table className="w-full text-center table-fixed font-mono">
                <tbody>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Block}
                        </td>
                        <td className=" px-3 py-1">
                            {data &&
                                <Link href={`/${lang}/block/${data.ledger_attr}`}>
                                            <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-400 text-white rounded-full">
                                            {data.ledger_attr}
                                            </span>
                                </Link>
                            }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Hash}
                        </td>
                        <td className=" px-3 py-1 font-bold">
                            {data&&
                            data.hash.substring(0,8)+'...'
                            }
                            
                        </td>
                    </tr>
                    
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Operation}
                        </td>
                        <td className=" px-3 py-1">
                        {data&&
                        data.operation_count
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Account}
                        </td>
                        <td className=" px-3 py-1">
                            {data &&
                                <Link href={`/${lang}/account/${data.source_account}`}>
                                            <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-400 text-white rounded-full">
                                            {data.source_account.substring(0,4)}
                                            </span>
                                </Link>
                            }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Fee}
                        </td>
                        <td className=" px-3 py-1">
                        {data&&
                        <>
                        <span className="font-bold">
                            {data.fee_charged/10000000} &#x3C0;
                        </span>
                        </>
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Memo}
                        </td>
                        <td className=" px-3 py-1">
                            {data&&
                        <>
                        <span className="font-bold">
                            {data.memo ? data.memo:<>{transcript.None}</>}

                        </span>
                        </>
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className="px-3 py-1" colSpan={2}>
                        {data&&data.successful&&
                        <>
                        <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-green-400 text-white rounded-full">
                            {transcript.Success}
                        </span>
                        </>
                        }
                        {data&&!data.successful&&
                        <>
                        <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-600 text-white rounded-full">
                            {transcript.Failed}
                        </span>
                        </>
                        }
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
        </>
    )
}