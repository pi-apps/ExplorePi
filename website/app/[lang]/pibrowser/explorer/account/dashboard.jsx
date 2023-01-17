'use client'
import { Server } from "stellar-sdk"
import { useEffect, useState } from "react"
import styles from './styles.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins, faCube, faLock, faUserClock } from "@fortawesome/free-solid-svg-icons"
import { Josefin_Sans } from "@next/font/google"
import { useSearchParams } from "next/navigation"

const roboto = Josefin_Sans({
    weight: '600',
    subsets: ['latin']
  })

export default function AccountDashboard({transcript}){
    const searchaccount = useSearchParams()
    const account = searchaccount.get('account')
    const server = new Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [weight,setweight] = useState(0)
    const [claimablebalance,setclaimablebalance] = useState(0.0000000)
    const [balance,setbalance] = useState(0)
    const [subentry,setsubentry] = useState(0)
    const [last_modify,setlast_modify] = useState(0)
    const [claimstatus,setclaimstatus] = useState(false)
    const [selected,setselected] = useState("operation")
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
            <div className="grid gap-4 grid-cols-2 pb-4 border-b">
                <div className={`${styles.balance} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faCoins} className={styles.balance_icon}/>
                        <div className="block">
                            <div className={` ${styles.balance_block} leading-none ml-3 align-bottom font-mono font-bold`}>{parseFloat(balance)} 
                                <span className=" text-purple-500"> Pi</span>
                            </div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.Balance}</div>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.subentry} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faCube} className={styles.subentry_icon}/>
                        <div className="block">
                            <div className={`font-bold font-mono ${styles.subentry_block} leading-none ml-3 align-bottom`}>{parseInt(subentry)}</div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.SubEntry}</div>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.lastactive} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faUserClock} className={styles.lastactive_icon}/>
                        <div className="block">
                            <div className={`font-bold font-mono ${styles.last_block} leading-none ml-3 align-bottom`}>{parseInt(last_modify)}</div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.LastActiveBlock}</div>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.lock} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faLock} className={styles.lock_icon}/>
                        <div className="block">
                            <div className={`font-bold font-mono ${styles.lock_block} leading-none ml-3 align-bottom`}>
                                {claimstatus ? parseFloat(claimablebalance) : <div className="spinner-border animate-spin inline-block border-4 w-4 h-4 rounded-full text-blue-300" role="status"></div>}
                                <span className=" text-purple-500"> Pi</span>
                            </div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.LockUpBalance}</div>
                        </div>                        
                    </div>
                </div>
            </div>

            <select className="form-select form-select-sm appearance-none block w-full px-2 py- font-semibold text-gray-700
            bg-white bg-clip-padding bg-no-repeat text-center
            border border-solid border-gray-300
            rounded-xl transition ease-in-out mt-4
            focus:text-gray-700 focus:border-blue-500 focus:outline-none" value={selected} onChange={e=>{setselected(e.target.value)}}>
                <option value="operation">OPERATION</option>
                <option value="lockbalance">LockBalance</option>
                <option value="offers">Offers</option>
                <option value="data">DATA</option>
            </select>


        </section>
        </>
    )
}