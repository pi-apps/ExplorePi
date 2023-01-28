import admin from "lib/database";
import Block from "./block"
import Top10 from "./top10"
import Distribute from "./operation"
import Claimant from "./claimant";
export const revalidate =  86400





export default async function StatisticPage({params:{lang}}){
    const db = admin.firestore();
    const data = await db.collection('statistic').doc('data').get()
    const dataobj = data.data()
    const update = new Date(dataobj.timestamp)
    return(
        <>
        
        <div className="mx-4 h-stream mt-2 overflow-y-scroll ">
            <h2 className="text-center underline decoration-indigo-500 decoration-2 underline-offset-2 font-bold text-orange-400">Latest Update at : UTC {update.toISOString().split('T')[0]}</h2>
            <Top10 data={dataobj} lang={lang}/>
            <div className="w-full">
                <Claimant data={dataobj}/>
            </div>
            <div className="w-full">
                <Block data={dataobj}/>
            </div>
            <div className="w-full">
                <Distribute data={dataobj}/>
            </div>
        </div>        
        </>
    )
}