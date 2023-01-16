import Search from "./formsearch";

export default async function ExplorerLayout({children,params: { lang }}){
    
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <div className=' h-screen overflow-y-hidden overflow-x-hidden pb-14'>
            <Search transcript={transcript.explorer.Search}/>         
            {children}
        </div>
        </>
    )
}