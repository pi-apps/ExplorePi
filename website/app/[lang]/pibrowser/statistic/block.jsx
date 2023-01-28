'use client'
import { useEffect, useState } from "react"
import { ResponsiveLine } from "@nivo/line"


const commonProperties = {
    margin: { top: 20, right: 20, bottom: 60, left: 40 }
}
export default function Block({data}){
    if(!data) return
    const [filter,setfilter] = useState([])
    const [tidydata,settidydata] = useState([])
    const [range,setrange] = useState(null)
    useEffect(()=>{
        setfilter([])
        data.blocktime.map(data=>{
            if(data.y>10)
            data.y=null
            settidydata(predata=>[...predata,data])
        })
    },[data])
    useEffect(()=>{
        if(!range) return
        if(range==='all')
        setfilter(tidydata)
        else if(range==='m')
        setfilter(tidydata.slice(-31))
        else if(range==='y')
        setfilter(tidydata.slice(-365))
    },[range])
    return(
        <>
        <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom ">
            Block Closed Time
        </div>
        <div className="flex items-center justify-center mb-3">
            <div className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg" role="group">
                <button type="button" className="rounded-l inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-0 active:bg-yellow-700 transition duration-150 ease-in-out" onClick={()=>setrange('m')}>Month</button>
                <button type="button" className="inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-0 active:bg-yellow-700 transition duration-150 ease-in-out" onClick={()=>setrange('y')}>Year</button>
                <button type="button" className="rounded-r inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-0 active:bg-yellow-700 transition duration-150 ease-in-out" onClick={()=>setrange('all')}>All</button>
            </div>
        </div>
        <ResponsiveLine
            {...commonProperties}
            data={[
                {
                    id: 'closed time',
                    data: filter,
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
                min:5,
                max:6.6
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
        <div className="text-transparent mb-2 bg-border bg-border-size bg-no-repeat bg-left-bottom text">
        end block
        </div>
        </>
    )
}