'use client'
import { useEffect, useState } from "react"
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import { Doughnut } from "react-chartjs-2"

export default function LockTime({data,transcript}){
    if(!data) return
    const option = {
        maintainAspectRatio : false,
        plugins:{
            legend:{
                position:'left'
            }
        }
    }
    const [tidydata,settidydata] = useState(null)
    const [dataset,setdataset] = useState([])
    useEffect(()=>{
        setdataset([
            data.lockuptime[0].no_lock,
            data.lockuptime[0].twoweek,
            data.lockuptime[0].sixmonths,
            data.lockuptime[0].oneyear,
            data.lockuptime[0].threeyear
        ])
        
    },[data])
    useEffect(()=>{
        if(!dataset) return
        settidydata({
            labels:[transcript.No,transcript.two_week,transcript.six_month,transcript.oneyear,transcript.threeyears],
            datasets: [
                {
                label:transcript.Pioneers,
                data: dataset,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
                },
            ],
        })
    },[dataset])
    if(!tidydata) return
    return(
        <>
        <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom ">
            {transcript.title}
        </div>
        <div className="h-40">
        <Doughnut data={tidydata} options={option} />
        </div>
        </>
    )
}