'use client'
import styles from './stream.module.css'
import { useEffect, useState } from "react"
import { formatTrans } from "lib/translate";
import Operation from "./operation";
import Payment from "./payment";
import Block from './block';
import Transaction from './transaction';
import { Button } from '@nextui-org/react';
export default function StreamContent({transcript,explorer,time,lang}){
    const [selected,setselected] = useState('operation')
    const [Input,setInput] = useState('')
    const [placeholder,setplaceholder] = useState(transcript.Optional)
    const [start,setstart] = useState(false)
    useEffect(()=>{
        if(selected==='account')
        setplaceholder(transcript.Required)
        else
        setplaceholder(transcript.Optional)
    },[selected])

    const handleStart = () =>{
        setstart(!start)
    }
    const handleselect = (e) =>{
        setstart(false)
        setselected(e.target.value)
    }
    return(
        <>
        <section className='bg-slate-100 px-5 shadow mx-5 w-auto rounded-lg mt-4 py-2'>
            <select className="form-select form-select-sm appearance-none text-center block w-full px-2 font-semibold text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            rounded-xl transition ease-in-out mt-2 mb-3
            focus:text-gray-700 focus:border-blue-500 focus:outline-none" value={selected}            
            onChange={handleselect} disabled={start}>
                <option value="operation">{transcript.op.title}</option>
                <option value="block">{transcript.block.Block}</option>
                <option value="tx">{transcript.tx.title}</option>
                <option value="payment">{transcript.pay.title}</option>
            </select>
            {selected!=='block' &&<input 
                onChange={(e)=>setInput(e.target.value)}
                value={Input}
                className="focus:ring-2 focus:ring-zink-50 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2  ring-1 ring-slate-200 shadow-sm" type="text" 
                aria-label="Account option" 
                placeholder={formatTrans(transcript.input,{need:placeholder})}/>}
            <div className="flex justify-center mt-1">
                {start===false && <Button size="lg" className="font-mono text-white font-extrabold text-base bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl" onClick={handleStart}>{transcript.but_start}</Button>}
                {start === true && <Button size="lg" className="font-mono text-white font-extrabold text-base bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl" onClick={handleStart}>{transcript.but_stop}</Button>}
                
            </div>
        </section>
        <div className="mt-2 border mx-4"></div>
        <section className={`${styles.content_table} mt-2 mx-4 w-auto pb-14 overflow-y-scroll`}>
            {selected==='operation' && <Operation lang={lang} status={start} transcript={explorer.operation} account={Input} time={time}/>}
            {selected==='block'&&<Block lang={lang} status={start} transcript={transcript.block} time={time}/>}
            {selected==='tx'&&<Transaction lang={lang} status={start} transcript={explorer.transaction} time={time} account={Input}/>}
            {selected==='payment' && <Payment lang={lang} status={start} transcript={explorer.payment} account={Input} time={time}/>}
        </section>
        </>
    )
}