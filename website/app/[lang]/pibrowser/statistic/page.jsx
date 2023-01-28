import admin from "lib/database";
import Block from "./block"
import Top10 from "./top10"
//export const revalidate =  86400





export default async function StatisticPage({params:{lang}}){
    const db = admin.firestore();
    const data = await db.collection('statistic').doc('data').get()
    const dataobj = data.data()
    return(
        <>
        <div className="mx-4 h-stream mt-2 overflow-y-scroll">
            <Top10 data={dataobj} lang={lang}/>
            <div className="w-full h-80">
                <Block data={dataobj}/>
            </div>
        </div>        
        </>
    )
}