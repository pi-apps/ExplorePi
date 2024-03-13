import 'server-only'
import admin from "lib/database";
import Block from "./block"
import Top10 from "./top10"
import Distribute from "./operation"
import Claimant from "./claimant";
import { translate } from "translate-config";
import LockTime from "./locktime";
import { Roboto_Mono } from "next/font/google";
export const revalidate =  86400


const roboto_Mono = Roboto_Mono({
    subsets: ['latin'],
    display: 'swap',
  })

export async function generateStaticParams() {
  return translate.locales.map(locale => ({lang:locale}));
}

export default async function StatisticPage({params:{lang}}){
    const transcript = await import(`locales/${lang}.json`);
    const db = admin.firestore();
    const data = await db.collection('statistic').doc('data').get()
    let dataobj = data.data()
    /*block data*/
    dataobj.blocktime.map(data=>{
        if(data.y>10)
        data.y=null
        data.x = new Date(data.x).getTime()
    })
    dataobj.blocktimeMonth.map(data=>{
        if(data.y>10)
        data.y=null
        data.x = new Date(data.x).getTime()
    })
    dataobj.claimedMonth.map(data=>{
        data.x = new Date(data.x).getTime()
    })
    dataobj.claimedbackMonth.map(data=>{
        data.x = new Date(data.x).getTime()
    })
    dataobj.createclaimantMonth.map(data=>{
        data.x = new Date(data.x).getTime()
    })
    dataobj.claimed.map(data=>{
        data.x = new Date(data.x).getTime()
    })
    dataobj.claimedback.map(data=>{
        data.x = new Date(data.x).getTime()
    })
    dataobj.createclaimant.map(data=>{
        data.x = new Date(data.x).getTime()
    })
    const update = new Date(dataobj.timestamp)
    const totalpioneer = Number.parseInt(dataobj.lockuptime[0].no_lock+
    dataobj.lockuptime[0].oneyear+
    dataobj.lockuptime[0].sixmonths+
    dataobj.lockuptime[0].threeyear+
    dataobj.lockuptime[0].twoweek).toLocaleString("en-US")
    return(
        <>
        
        <div className="mx-4 h-[calc(100vh_-_58px)] w-[calc(100vw_-_16rem)] px-10 mt-2 pb-10 overflow-y-scroll ">
            <h2 className="text-center underline decoration-indigo-500 decoration-2 underline-offset-2 font-bold text-orange-400">Latest Update at : UTC {update.toISOString().substr(0,16).replace('T',' ')}</h2>
            
            <div className={roboto_Mono.className+' w-full'}>
            <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom">
            {transcript.statistic.Metrics.title}
            </div>
                <div className=" rounded-md overflow-hidden shadow-lg mb-4">
                    <table className="w-full text-center table-fixed">
                        <tbody>
                            <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                                <td className=" py-2 font-medium">
                                    {transcript.statistic.Metrics.TotalAccount}
                                </td>
                                <td className=" px-3 py-2">
                                    {Number.parseInt(dataobj.metric.TotalAccount).toLocaleString("en-US")}
                                </td>
                            </tr>
                            <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                                <td className=" py-2 font-medium">
                                    {transcript.statistic.Metrics.TotalPioneer}
                                </td>
                                <td className=" px-3 py-2">
                                    {totalpioneer}
                                </td>
                            </tr>
                            <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                                <td className="  py-2 font-medium">
                                {transcript.statistic.Metrics.MigratedPi}
                                </td>
                                <td className=" px-3 py-2 text-xs">
                                    {Number.parseFloat(dataobj.metric.TotalPi).toLocaleString("en-US",{maximumFractionDigits:7})} Pi
                                </td>
                            </tr>
                            <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                                <td className="  py-2 font-medium">
                                {transcript.statistic.Metrics.PioneerHold}
                                </td>
                                <td className=" px-3 py-2 text-xs">
                                    {Number.parseFloat(dataobj.metric.TotalClaim).toLocaleString("en-US",{maximumFractionDigits:7})} Pi
                                </td>
                            </tr>
                            <tr className="border-b border-[#F7E4BE] bg-[#FBF2DE] text-neutral-800">
                                <td className="  py-2 font-medium">
                                {transcript.statistic.Metrics.PiLocked}
                                </td>
                                <td className=" px-3 py-2 text-xs">
                                    {Number.parseFloat(dataobj.metric.TotalLock).toLocaleString("en-US",{maximumFractionDigits:7})} Pi
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <Top10 data={dataobj} lang={lang} transcript={transcript.statistic.TOP10}/>

            <div className="w-full">
                <Claimant data={dataobj} transcript={transcript.statistic.Migrate}/>
            </div>
            <div className="w-full">
                <Block data={dataobj} transcript={transcript.statistic.Block}/>
            </div>
            <div className="w-full">
                <LockTime data={dataobj} transcript={transcript.statistic.LockUP}/>
            </div>

        </div>        
        </>
    )
}