import StartButton from "./start"
import NavBar from "./navbar";
export default async function StreamLayout({children,params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    return (
        <>
        <div className='w-screen h-screen overflow-hidden bg-white'>
            <StartButton transcript={transcript.stream.start}>
                {children}
            </StartButton>
        </div>
        <NavBar transcript={transcript.navbar} lang={lang}/>
        </>
    )
    
}