import Search from "./formsearch";
import NavBar from "./navbar";
export default async function ExplorerLayout({children,params: { lang }}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <div className='w-screen h-screen overflow-hidden bg-white'>
            <div className=' h-screen overflow-y-hidden overflow-x-hidden pb-14'>
                <Search transcript={transcript.explorer.Search}/>         
                {children}
            </div>
        </div>
        <NavBar transcript={transcript.navbar} lang={lang}/>
        </>
    )
}