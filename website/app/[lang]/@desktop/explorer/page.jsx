import Link from "next/link";
import Block from "./block";
import Operation from "./operation";
import Payment from "./payment";
import Transaction from "./transaction";
import Switcher from "./switch";

export default async function ExplorerPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <div className="p-5 pb-10 w-full h-full overflow-hidden">
            <div className="flex w-full h-full">
                <Switcher lang={lang} time={transcript.time}>
                    
                </Switcher>
            </div>

            
        </div>
        </>
    )
}