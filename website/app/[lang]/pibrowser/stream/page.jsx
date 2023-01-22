import StreamContent from "./stream";

export default async function StreamPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return(
        <>
        <StreamContent transcript={transcript.stream} explorer={transcript.explorer} time={transcript.time}/>
        </>
    )
}