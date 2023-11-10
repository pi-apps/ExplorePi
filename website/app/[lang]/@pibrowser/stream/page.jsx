import StreamContent from "./stream";
import { translate } from "translate-config";
export async function generateStaticParams() {
  return translate.locales.map(locale => ({lang:locale}));
}

export default async function StreamPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <StreamContent lang={lang} transcript={transcript.stream} explorer={transcript.explorer} time={transcript.time}/>
        </>
    )
}