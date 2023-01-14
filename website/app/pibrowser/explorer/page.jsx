'use client'

import Block from "./block";
import Payment from "./payment";
import Transaction from "./transaction";
export default function ExplorerPage(){
   
    return(
        <>
        <section className="h-explorer m-5 bg-slate-50 rounded p-4 overflow-y-scroll">
            <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            Latest 10 Blocks
            </div>
            <Block/>
            <div className="text-center mt-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            Latest Payments
            </div>
            <Payment/>
            <div className="text-center mt-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            Latest 10 Transactions
            </div>
            <Transaction/>
        </section>
        </>
    )
}