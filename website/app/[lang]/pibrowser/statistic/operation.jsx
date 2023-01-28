'use client'
import { useEffect, useState } from "react"
import { ResponsivePie  } from "@nivo/pie"

export default function Distribute({data}){
    if(!data) return
    const [tidydata,settidydata] = useState([])
    useEffect(()=>{
        settidydata([])
        data.opdistribute.map(data=>{
            let format
            switch (data.op) {
                case 0:
                    format={
                        id:'create_account',
                        label:'create_account',
                        value:data.total
                    }
                    break;
                case 1:
                    format={
                        id:'payment',
                        label:'payment',
                        value:data.total
                    }
                    break;
                case 14:
                    format={
                        id:'create_claimant',
                        label:'create_claimant',
                        value:data.total
                    }
                    break;
                case 15:
                    format={
                        id:'claim_claimable_balance',
                        label:'claim_claimable_balance',
                        value:data.total
                    }
                    break;
                default:
                    format={
                        id:data.op,
                        label:data.op,
                        value:data.total
                    }
                    break;
            }
            settidydata(predata=>[...predata,format])
        })
    },[data])

    return(
        <>
        <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom ">
            Total Operation Distribute
        </div>
        <div className="h-40">
        <ResponsivePie
        margin= {{ top: 20, right: 20, bottom: 60, left: 40 }}
        data={tidydata}
        innerRadius={0.6}
        padAngle={0.5}
        cornerRadius={5}
        arcLinkLabelsColor={{
            from: 'color',
        }}
        arcLinkLabelsThickness={3}
        arcLinkLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 1.2]],
        }}/>
        </div>
        </>
    )
}