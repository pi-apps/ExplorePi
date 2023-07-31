'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Search({lang,transcript}){
    const router = useRouter()
    const [Input,setInput] = useState('')

    const handleSearch = (e) =>{
        e.preventDefault()
        //check input
        if(Input.match(/^G[A-Za-z0-9]{55}/)){
            //public_key
            router.push(`/${lang}/account/`+Input)
            setInput('')
        }
        else if(Input.toLowerCase().match(/[a-z0-9]{64}/)){
            router.push(`/${lang}/tx/`+Input)
            setInput('')
        }
        else if(Input.match(/^\d+$/)){
            router.push(`/${lang}/block/`+Input)
            setInput('')
        }else{
            //pop warning message
        }

    }
    return(
        <>
            <section className=" bg-slate-100 px-5 shadow mx-5 w-auto rounded-lg mt-4 py-4">
            <form className="group relative" onSubmit={(e)=>handleSearch(e)}>
                <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                </svg>
                <input 
                onChange={(e)=>setInput(e.target.value)}
                value={Input}
                className="focus:ring-2 focus:ring-zink-50 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Search Bar" placeholder={transcript.placeholder}/>
            </form>
            </section>            
        </>
    )
}