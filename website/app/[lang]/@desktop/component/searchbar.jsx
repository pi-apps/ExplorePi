'use client'
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Searchbar({lang}){
    const router = useRouter()
    const [Input,setInput] = useState('')

    const handleSearch = (e) =>{
      e.preventDefault()
      //check input
      if(Input.match(/^G[A-Za-z0-9]{55}/)){
          //public_key
          router.push(`./${lang}/account/`+Input)
          setInput('')
      }
      else if(Input.toLowerCase().match(/[a-z0-9]{64}/)){
          router.push(`./${lang}/tx/`+Input)
          setInput('')
      }
      else if(Input.match(/^\d+$/)){
          router.push(`./${lang}/block/`+Input)
          setInput('')
      }else{
          //pop warning message
      }

    }
    return(
      <>
      <nav className="h-[58px] w-full bg-[#212529] md:block items-center hidden">
        <div className="w-full mx-auto md:flex-nowrap flex-wrap">
          {/* Form */}
          <form className="group relative" onSubmit={(e)=>handleSearch(e)}>
            <div className="relative flex w-full flex-wrap items-stretch">
              <svg width="20" height="20" fill="currentColor" className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none " aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              <input 
                onChange={(e)=>setInput(e.target.value)}
                value={Input}
                className="focus:outline-0 focus:ring-search-bar focus:ring-0 bg-search-bar appearance-none w-full text-base leading-6 text-slate-100 placeholder-slate py-4 pl-10" type="text" aria-label="SearchBar" placeholder="Block/TX/Account"/>
            </div>
          </form>
        </div>
      </nav>
      </>
    )
  {/* End Navbar */}
}