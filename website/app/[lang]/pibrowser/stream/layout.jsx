import StartButton from "./start"

export default async function StreamLayout({children,params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return (
        <>
        <StartButton transcript={transcript.stream}>
            {children}
        </StartButton>
        </>
    )
    
}