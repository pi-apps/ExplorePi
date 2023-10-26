'use client'
import { BrowserContext } from "app/getuser"
import { useContext } from "react"

export default function PersonalPage(){
    const pimode = useContext(BrowserContext)
    console.log(pimode.pimode)
    const authcheck = () =>{
        fetch(
            '/api/auth',
            {
                headers:{
                    'Authorization': `${pimode.pimode.accessToken}`
                }
            }
        )
    }
    return(<>

    </>)
}