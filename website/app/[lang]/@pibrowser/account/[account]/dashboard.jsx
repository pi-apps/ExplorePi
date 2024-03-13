'use client'
import { Horizon } from "stellar-sdk"
import { useEffect, useState } from "react"
import styles from './styles.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins, faCube, faLock, faPaste, faShareFromSquare, faUserClock } from "@fortawesome/free-solid-svg-icons"
import Operation from "./operation"
import LockBalance from "./lockbalance"
import Signer from "./signer"
import Data from "./data"
import Offer from "./offer"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

export default function AccountDashboard({transcript,time,account}){
    const server = new Horizon.Server(process.env['NEXT_PUBLIC_HORIZON_SERVER'])
    const [weight,setweight] = useState(0)
    const [claimablebalance,setclaimablebalance] = useState(0.0000000)
    const [balance,setbalance] = useState(0)
    const [subentry,setsubentry] = useState(0)
    const [last_modify,setlast_modify] = useState(0)
    const [claimstatus,setclaimstatus] = useState(false)
    const [selected,setselected] = useState("operation")

    useEffect(()=>{
        if(!account)return
        setbalance(0)
        setclaimablebalance(0.000000)
        setlast_modify(0)
        setsubentry(0)

        server.accounts()
        .accountId(account)
        .cursor('now')
        .order('desc')
        .call().then( res => {
            res.operations().then(res=>{console.log(res)})
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

    },[account])

    const handlecopy = async () =>{
        await navigator.clipboard.writeText(account);
        toast.success('Copied!')
    }
    const handleshare = async () =>{
        window.Pi.openShareDialog('Share This Account', 'pi://'+process.env['NEXT_PUBLIC_DOMAIN']+'/account/'+account)
    }
    return(
        <>
        <ToastContainer position="top-center" autoClose={1500} closeButton={false}/>
        <section className=" m-4 overflow-y-scroll h-full pb-28">
            <div className="text-center text-2xl font-semibold border-b mx-4">
                Public Key
            </div>
            <div className="text-center my-1 mx-4 break-words">
                {account}
            </div>
            
            <div className="flex justify-around pb-2 text-red-900 text-lg mb-2 border-b mx-4" >
                
                <FontAwesomeIcon icon={faPaste} onClick={handlecopy}/>
                <FontAwesomeIcon  icon={faShareFromSquare} onClick={handleshare}/>
            </div>
            
            <div className="grid gap-4 grid-cols-2 pb-4 border-b">
                <div className={`${styles.balance} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faCoins} className={styles.balance_icon+' ml-2'}/>
                        <div className="block w-full pr-2">
                            <div className={` ${styles.balance_block} leading-none ml-3 align-bottom font-mono font-bold break-words`}>{parseFloat(balance)} 
                                <span className=" text-purple-500"> Pi</span>
                            </div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.account.Balance}</div>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.subentry} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center">
                        <FontAwesomeIcon icon={faCube} className={styles.subentry_icon}/>
                        <div className="block">
                            <div className={`font-bold font-mono ${styles.subentry_block} leading-none ml-3 align-bottom`}>{parseInt(subentry)}</div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.account.SubEntry}</div>
                        </div>                        
                    </div>
                </div>

                <div className={`${styles.lastactive} shadow w-full h-20 rounded-xl flex items-center justify-center`}>
                    <div className="flex justify-center items-center w-full px-2">
                        <FontAwesomeIcon icon={faUserClock} className={styles.lastactive_icon}/>
                        <div className="block">
                            <div className={`font-bold font-mono ${styles.last_block} leading-none ml-3 align-bottom`}>{parseInt(last_modify)}</div>
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.account.LastActiveBlock}</div>
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
                            <div className=" leading-none align-top ml-3 text-neutral-500">{transcript.account.LockUpBalance}</div>
                        </div>                        
                    </div>
                </div>
            </div>

            <select className="form-select form-select-sm appearance-none text-center block w-full px-2 font-semibold text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded-xl transition ease-in-out mt-4 mb-3
            focus:text-gray-700 focus:border-blue-500 focus:outline-none" value={selected} onChange={e=>{setselected(e.target.value)}}>
                <option value="operation">OPERATION</option>
                <option value="lockbalance">LockBalance</option>
                <option value="offers">Offers</option>
                <option value="data">Data</option>
                <option value="signers">Signers</option>
            </select>
            {selected=='operation' && <Operation time={time} transcript={transcript.operation} account={account}/>}
            {selected=='lockbalance' && <LockBalance transcript={transcript.lockbalance} account={account}/>}
            {selected=='offers' && <Offer/>}
            {selected=='data' && <Data/>}
            {selected=='signers' && <Signer/>}
        </section>
        </>
    )
}