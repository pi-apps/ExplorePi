'use client'
import { BrowserContext } from "app/getuser"
import { useContext } from "react"

export default function PersonalPage(){
    const pimode = useContext(BrowserContext)
    console.log(pimode.pimode)
    const authcheck =async () =>{
        let res = await fetch(
            '/api/auth',
            {
                headers:{
                    'Authorization': `${pimode.pimode.accessToken}`
                }
            }
        )
        let token = await res.text()
        window.Pi.openUrlInSystemBrowser('https://explorepi.info/login?token='+token)
        
    }
    if(pimode.pimode.user.username == '0205miss')
    return(<>
        <div className=" h-screen overflow-y-hidden overflow-x-hidden pb-14 flex justify-center items-center">
            <div className=" h-10 w-1/2 bg-teal-400 rounded-lg items-center flex justify-center" onClick={authcheck}>Login ExplorePi APP</div>
        </div>
    </>)
    return(
        <></>
    )
}