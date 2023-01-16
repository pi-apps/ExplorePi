import AccountDashboard from "./dashboard"


export default async function AccountPage({params:{lang,account}}){
    
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <AccountDashboard account={account} transcript={transcript.account}/>
        </>
    )
}