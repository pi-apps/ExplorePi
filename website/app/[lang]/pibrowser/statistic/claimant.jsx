'use client'
import { ResponsiveLine } from "@nivo/line"


const commonProperties = {
    margin: { top: 20, right: 50, bottom: 60, left: 50 }
}
export default function Claimant({data}){
    if(!data) return
    return(
        <>
        <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom ">
            Migrate Frequency
        </div>
        <div className=" h-72">
        <ResponsiveLine
            {...commonProperties}
            
            data={[
                {
                    id: 'create_claimant',
                    data: data.createclaimant,
                },{
                    id: 'claimed frequency',
                    data:data.claimed
                },{
                    id: 'CT claimback',
                    data:data.claimedback
                }
            ]}
            xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{
                type: 'linear',
                stacked: false,
            }}
            axisBottom={{
                format: '%b %d',
                tickValues: 5,
                
            }}
            enablePoints={false}
            pointBorderWidth={1}
            pointBorderColor={{
                from: 'color',
                modifiers: [['darker', 0.3]],
            }}
            useMesh={true}
            enableSlices={false}
        />
        </div>
        <div className="text-transparent mb-2 bg-border bg-border-size bg-no-repeat bg-left-bottom text">
        end block
        </div>
        </>
    )
}