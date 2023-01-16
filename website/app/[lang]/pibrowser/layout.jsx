import NavBar from "./navbar";

export default async function NavLayout({children,params: { lang }}){
    const transcript = await import(`locales/${lang}.json`);

    return(
        <>
        <div className='w-screen h-screen overflow-hidden bg-white'>            
                {children}
        </div>
        <NavBar transcript={transcript.navbar}/>
        </>
    )
}