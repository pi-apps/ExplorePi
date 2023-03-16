'use client'
import { useEffect, useState } from "react"
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import { Doughnut } from "react-chartjs-2"

export default function Distribute({data,transcript}){
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
    const [label,setlabel] = useState([])
    const [dataset,setdataset] = useState([])
    useEffect(()=>{
        setdataset([])
        setlabel([])
        data.opdistribute.map(data=>{
            setdataset(predata=>[...predata,data.total])
            switch (data.op) {
                case 0:                    
                    setlabel(predata=>[...predata,transcript.type.create_account])
                    break;
                case 1:
                    setlabel(predata=>[...predata,transcript.type.payment])
                    break;
                case 14:
                    setlabel(predata=>[...predata,transcript.type.create_claimable_balance])
                    break;
                case 15:
                    setlabel(predata=>[...predata,transcript.type.claim_claimable_balance])
                    break;
                default:
                    setlabel(predata=>[...predata,data.op])
                    break;
            }            
        })
    },[data])
    useEffect(()=>{
        if(!label) return
        if(!dataset) return
        settidydata({
            labels:label,
            datasets: [
                {
                label:transcript.Total,
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
    },[label,dataset])
    if(!tidydata) return
    return(
        <>
        <div className="text-center mb-2 font-bold text-lg bg-border bg-border-size bg-no-repeat bg-left-bottom ">
            {transcript.title}
        </div>
        <div className="h-40">
        <Doughnut data={tidydata} options={option} />
        </div>
        <div className="text-transparent mb-2 bg-border bg-border-size bg-no-repeat bg-left-bottom text">
        end block
        </div>
        </>
    )
}