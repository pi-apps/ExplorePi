import AccountDashboard from "./dashboard"


export default async function BlockPage({params:{lang}}){
    
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        
        <BlockDashboard transcript={transcript.explorer} time={transcript.time}/>
        </>
    )
}