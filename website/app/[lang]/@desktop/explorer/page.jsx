import Link from "next/link";
import Block from "./block";
import Operation from "./operation";
import Payment from "./payment";
import Transaction from "./transaction";

export default async function ExplorerPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <div className="p-5 pb-16 w-full">
            <div className="flex flex-wrap justify-around">
                <div className="w-11/12 xl:basis-5/12 bg-white rounded-lg shadow-md p-4">
                    <div className="w-full text-center">
                        <Link href={lang+'/block'} className="font-semibold text-lg">
                        Block
                        </Link>
                    </div>
                    <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25"></hr>
                    <Block lang={lang} status={true} time={transcript.time}/>
                </div>
                <div className="mt-2 xl:mt-0 w-11/12 xl:basis-5/12 bg-white rounded-lg shadow-md p-4">
                    <div className="w-full text-center">
                        <Link href={lang+'/tx'} className="font-semibold text-lg">
                        Transaction
                        </Link>
                    </div>
                    <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25"></hr>
                    <Transaction lang={lang} status={true}/>
                </div>
            </div>
            <div className="flex flex-wrap justify-around mt-5">
                <div className="w-11/12 xl:basis-5/12 bg-white rounded-lg shadow-md p-4">
                    <div className="w-full text-center">
                        <Link href={lang+'/operation'} className="font-semibold text-lg">
                        Operation
                        </Link>
                    </div>
                    <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25"></hr>
                    <Operation lang={lang} status={true}/>
                </div>
                <div className="mt-2 xl:mt-0 w-11/12 xl:basis-5/12 bg-white rounded-lg shadow-md p-4">
                    <div className="w-full text-center">
                        <Link href={lang+'/payment'} className="font-semibold text-lg">
                        Payment
                        </Link>
                    </div>
                    <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25"></hr>
                    <Payment lang={lang} status={true}/>
                </div>
            </div>
        </div>
        </>
    )
}