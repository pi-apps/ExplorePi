import GetUser from "./getuser";
export default async function Layout({desktop, pibrowser,params: { lang }}){
    const transcript = await import(`locales/${lang}.json`);
    return(<>
    <GetUser transcript={transcript.navbar} lang={lang} pibrowser={pibrowser} desktop={desktop}/>
    </>)

}