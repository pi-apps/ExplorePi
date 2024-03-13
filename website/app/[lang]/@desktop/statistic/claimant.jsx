'use client'
import { useEffect, useState } from "react"
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import { Bar } from "react-chartjs-2"

export default function Claimant({data,transcript}){
    if(!data) return
    const [option,setoption] = useState(null)
    const [range,setrange] = useState('all')
    const [datas,setdatas] = useState(null)
    useEffect(()=>{
      if(!range) return
      if(range==='all')
      {
        setoption({
            maintainAspectRatio : false,
            interaction: {
              mode: 'nearest',
              axis:'x',
              intersect: false,
            },
            stacked: false,
            elements:{
                point:{
                    radius:1,
                }
            },
            scales: {
                x: {
                    type: 'time'
                },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          })
        setdatas(
            {
                datasets: [
                  {
                    label: transcript.Unlock,
                    data: data.claimedMonth,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1',
                  },
                  {
                    label: transcript.Migrateop,
                    data: data.createclaimantMonth,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                  },
                  {
                    label: transcript.CTclaim,
                    data: data.claimedbackMonth,
                    borderColor: 'rgb(148, 126, 176)',
                    backgroundColor: 'rgba(148, 126, 176, 0.5)',
                    yAxisID: 'y1',
                  },
                ],
              }
        )
      }
      
      else if(range==='m')
      {
        setoption({
            maintainAspectRatio : false,
            interaction: {
              mode: 'x',
              intersect: false,
            },
            stacked: false,
            elements:{
                point:{
                    radius:1,
                }
            },
            scales: {
                x: {
                    type: 'time',
                    min: Date.now()-2629800000,
                    max: Date.now()
                },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    drawOnChartArea: false,
                  },
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          })
        setdatas(
            {
                datasets: [
                  {
                    label: transcript.Unlock,
                    data: data.claimed,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1',
                  },
                  {
                    label: transcript.lock,
                    data: data.createclaimant,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                  },
                  {
                    label: transcript.CTclaim ,
                    data: data.claimedback,
                    borderColor: 'rgb(148, 126, 176)',
                    backgroundColor: 'rgba(148, 126, 176, 0.5)',
                    yAxisID: 'y1',
                  },
                ],
              }
        )
      }
      else if(range==='y')
      {
        setoption({
            maintainAspectRatio : false,
            interaction: {
              mode: 'x',
              intersect: false,
            },
            stacked: false,
            elements:{
                point:{
                    radius:1,
                }
            },
            scales: {
                x: {
                    type: 'time',
                    min: Date.now()-31556952000,
                    max: Date.now()
                },
              y: {
                type: 'linear',
                display: true,
                position: 'left',
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          })
        setdatas(
            {
                datasets: [
                  {
                    label: transcript.Unlock,
                    data: data.claimedMonth,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y1',
                  },
                  {
                    label: transcript.lock,
                    data: data.createclaimantMonth,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y',
                  },
                  {
                    label: transcript.CTclaim,
                    data: data.claimedbackMonth,
                    borderColor: 'rgb(148, 126, 176)',
                    backgroundColor: 'rgba(148, 126, 176, 0.5)',
                    yAxisID: 'y1',
                  },
                ],
              }
        )
      }
    },[data,range])
    return(
        <>
        <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom ">
            {transcript.title}
        </div>
        <div className="flex items-center justify-center mb-3">
            <div className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg" role="group">
                <button type="button" className="rounded-l inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-0 active:bg-yellow-700 transition duration-150 ease-in-out" onClick={()=>setrange('m')}>{transcript.Month}</button>
                <button type="button" className="inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-0 active:bg-yellow-700 transition duration-150 ease-in-out" onClick={()=>setrange('y')}>{transcript.Year}</button>
                <button type="button" className="rounded-r inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase hover:bg-yellow-600 focus:bg-yellow-600 focus:outline-none focus:ring-0 active:bg-yellow-700 transition duration-150 ease-in-out" onClick={()=>setrange('all')}>{transcript.ALL}</button>
            </div>
        </div>
        <div className="h-48">
        {datas && <Bar options={option} data={datas} />}
        </div>        
        <div className="text-transparent mb-2 bg-border bg-border-size bg-no-repeat bg-left-bottom text">
        end block
        </div>
        </>
    )
}