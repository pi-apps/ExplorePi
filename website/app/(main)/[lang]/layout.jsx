import GetUser from "./getuser";
export default async function Layout({pibrowser,params: { lang }}){
    const transcript = await import(`locales/${lang}.json`);
    return(<>
    <GetUser transcript={transcript.navbar} lang={lang} pibrowser={pibrowser}/>
    </>)

}