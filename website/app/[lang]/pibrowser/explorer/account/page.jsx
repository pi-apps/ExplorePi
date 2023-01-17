import AccountDashboard from "./dashboard"


export default async function AccountPage({params:{lang}}){
    
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <AccountDashboard transcript={transcript.account}/>
        </>
    )
}