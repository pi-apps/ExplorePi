'use client'
import { Server } from "stellar-sdk"
import { useEffect, useState } from "react"
import { Spinner, Tabs } from "flowbite-react"
import styles from './styles.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins, faCube, faLock, faUserClock } from "@fortawesome/free-solid-svg-icons"
import { Josefin_Sans } from "@next/font/google"

const roboto = Josefin_Sans({
    weight: '600',
    subsets: ['latin']
  })

export default function AccountDashboard({transcript,account}){
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [weight,setweight] = useState(0)
    const [claimablebalance,setclaimablebalance] = useState(0.0000000)
    const [balance,setbalance] = useState(0)
    const [subentry,setsubentry] = useState(0)
    const [last_modify,setlast_modify] = useState(0)
    const [claimstatus,setclaimstatus] = useState(false)
    
    useEffect(()=>{
        console.log(account)
        server.accounts()
        .accountId(account)
        .cursor('now')
        .order('desc')
        .call().then( res => {
            res.offers().then(res=>{console.log(res)})            
            setsubentry(res.subentry_count)
            setlast_modify(res.last_modified_ledger)
            res.balances.map(data =>{
                if(data.asset_type ==="native")
                setbalance(data.balance)
            })
            res.signers.map(signer=>{
                setweight(weight+signer.weight)
            })
        })

        server.claimableBalances()
        .claimant(account)
        .order('desc')
        .call().then(res =>{
            console.log(res)
            res.records.map( data =>{
                if(data.asset==="native"){
                    setclaimablebalance((claimablebalance + parseFloat(data.amount)).toFixed(7))
                }
            })
            setclaimstatus(true)
        })

    },[])

    return(
        <>
        <section className=" m-4">
            <div className="grid gap-4 grid-cols-2">
                <div className={`${styles.balance} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faCoins} className={styles.balance_icon}/>
                        <div className="block">
                            <p className={` ${styles.balance_block} leading-none ml-3 align-bottom font-mono font-bold`}>{parseFloat(balance)} 
                                <span className=" text-purple-500"> Pi</span>
                            </p>
                            <p className=" leading-none align-top ml-3 text-neutral-500">{transcript.Balance}</p>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.subentry} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faCube} className={styles.subentry_icon}/>
                        <div className="block">
                            <p className={`font-bold font-mono ${styles.subentry_block} leading-none ml-3 align-bottom`}>{parseInt(subentry)}</p>
                            <p className=" leading-none align-top ml-3 text-neutral-500">{transcript.SubEntry}</p>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.lastactive} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faUserClock} className={styles.lastactive_icon}/>
                        <div className="block">
                            <p className={`font-bold font-mono ${styles.last_block} leading-none ml-3 align-bottom`}>{parseInt(last_modify)}</p>
                            <p className=" leading-none align-top ml-3 text-neutral-500">{transcript.LastActiveBlock}</p>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.lock} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faLock} className={styles.lock_icon}/>
                        <div className="block">
                            <p className={`font-bold font-mono ${styles.lock_block} leading-none ml-3 align-bottom`}>
                                {claimstatus ? parseFloat(claimablebalance) : <div className="spinner-border animate-spin inline-block border-4 w-4 h-4 rounded-full text-blue-300" role="status"></div>}
                                <span className=" text-purple-500"> Pi</span>
                            </p>
                            <p className=" leading-none align-top ml-3 text-neutral-500">{transcript.LockUpBalance}</p>
                        </div>                        
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <div className="flex text-center flex-wrap -mb-px border-b border-gray-200">
                    <button className="flex items-center justify-center p-4 text-sm font-medium first:ml-0 text-gray-400 rounded-t-lg">
                        OPERATION
                    </button>
                    <button className="flex items-center justify-center p-4 text-sm font-medium first:ml-0 text-gray-400 rounded-t-lg">
                        LockBalance
                    </button>
                    <button className="flex items-center justify-center p-4 text-sm font-medium first:ml-0 text-gray-400 rounded-t-lg">
                        Offers
                    </button>
                    <button className="flex items-center justify-center p-4 text-sm font-medium first:ml-0 text-gray-400 rounded-t-lg">
                        DATA
                    </button>
                </div>
            </div>

        </section>
        </>
    )
}