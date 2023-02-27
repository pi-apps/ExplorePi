
import Operation from "./op";
import Dashboard from "./dashboard";
import Share from "./share";

export default async function TxPage({params:{lang,tx_hash}}){
    
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <section className=" m-4 overflow-y-scroll h-full pb-28">
            <section className="my-2">
                <div className="text-center text-2xl font-mono font-semibold border-b mx-4">
                    Transaction 
                    <div className=" break-words">
                        {tx_hash}
                    </div>
                    <Share tx_hash={tx_hash}/>
                </div>
                
                <div className="text-center pb-2 text-purple-500 text-lg my-2 border-b mx-4" >
                    <Dashboard tx_hash={tx_hash}/>                 
                </div>
            </section>

            <section className="mx-2">
                <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
                    Operation
                </div>
            <Operation tx_hash={tx_hash} transcript={transcript.explorer.operation}/>
            </section>
        </section>
        </>
    )
}