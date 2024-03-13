'use client'
import { useEffect, useState } from "react"
import { Horizon } from "stellar-sdk"
import Link from "next/link"
export default function Dashboard({lang,block,transcript}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [data,setdata] = useState(null)
    useEffect(()=>{
        server.ledgers()
        .ledger(block)
        .call().then( res => {
            setdata(res)
        })
    },[block])
    return(
        <>
        <div className="font-semibold mb-1 underline">
        UTC {data && data.closed_at.substr(0,19).replace('T',' ')}
        </div>
        <div className=" rounded-xl overflow-hidden shadow-lg">   
            <table className="w-full text-center table-fixed font-mono">
                <tbody>
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
                            {transcript.Pre}
                        </td>
                        <td className=" px-3 py-1">
                            {data &&
                                <Link href={`/${lang}/block/${data.sequence-1}`}>
                                            <span className=" inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-bold bg-blue-400 text-white rounded-full">
                                            {data.prev_hash.substring(0,8)}...
                                            </span>
                                </Link>
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
                            {transcript.Transaction}
                        </td>
                        <td className=" px-3 py-1">
                        {data&&
                        <>
                        <span className="font-bold text-green-400">{data.successful_transaction_count}</span>
                        /
                        <span className="font-bold text-red-500">{data.failed_transaction_count}</span>
                        </>
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.BaseFee}
                        </td>
                        <td className=" px-3 py-1">
                        {data&&
                        <>
                        <span className="font-bold">
                            {data.base_fee_in_stroops/10000000} &#x3C0;
                        </span>
                        </>
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.BaseReserve}
                        </td>
                        <td className=" px-3 py-1">
                            {data&&
                        <>
                        <span className="font-bold">
                            {data.base_reserve_in_stroops/10000000} &#x3C0;
                        </span>
                        </>
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.FeePool}
                        </td>
                        <td className=" px-3 py-1">
                        {data&&
                        <>
                        <span className="font-bold">
                            {Number.parseFloat(data.fee_pool).toLocaleString("en-US",{maximumFractionDigits:7})} &#x3C0;
                        </span>
                        </>
                        }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.TotalPi}
                        </td>
                        <td className=" px-3 py-1">
                            {data&&
                                <>
                                <span className="font-bold">
                                    {Number.parseFloat(data.total_coins).toLocaleString("en-US",{maximumFractionDigits:7})} &#x3C0;
                                </span>
                                </>
                            }
                        </td>
                    </tr>
                    <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                        <td className=" py-1 font-medium">
                            {transcript.Protocol}
                        </td>
                        <td className=" px-3 py-1">
                            {data&&
                                <>
                                <span className="font-bold">
                                    V{data.protocol_version}
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