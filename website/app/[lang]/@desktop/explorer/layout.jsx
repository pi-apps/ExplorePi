export default async function ExplorerLayout({children,params: { lang }}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>      
            {children}
        </>
    )
}