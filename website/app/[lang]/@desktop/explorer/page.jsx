import BlockChainData from "./data";



export default async function ExplorerPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <div className="p-5 pb-10 w-full h-full overflow-hidden">
            <div className="flex w-full h-full flex-col">
                <BlockChainData/>
            </div>

            
        </div>
        </>
    )
}