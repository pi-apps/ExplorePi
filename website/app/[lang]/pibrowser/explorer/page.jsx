import Block from "./block";
import Payment from "./payment";
import Transaction from "./transaction";
export default async function ExplorerPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <section className="h-explorer m-5 bg-slate-100 rounded-xl p-4 overflow-y-scroll shadow-xl">
            <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            {transcript.explorer.LatestBlocks10}
            </div>
            <Block transcript={transcript.explorer.block}/>
            <div className="text-center mt-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            {transcript.explorer.LatestPayments}
            </div>
            <Payment transcript={transcript.explorer.payment}/>
            <div className="text-center mt-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            {transcript.explorer.LatestTransactions10}
            </div>
            <Transaction transcript={transcript.explorer.transaction}/>
        </section>
        </>
    )
}