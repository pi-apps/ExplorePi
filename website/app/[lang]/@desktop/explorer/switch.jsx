'use client'

import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Block from "./block"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link";
import Transaction from "./transaction"
import { useCallback } from "react"

useEmblaCarousel.globalOptions = { loop: true }

export default function Switcher({lang,time}){
    const [emblaRef, emblaApi] = useEmblaCarousel()
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
      }, [emblaApi])
    
      const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
      }, [emblaApi])
    return(
        <>
        <div className="h-full w-1/12 flex justify-center items-center text-[#212529] cursor-pointer" onClick={scrollPrev}>
            <FontAwesomeIcon icon={faAngleLeft} className="text-5xl"/>
        </div>

        <div className="h-full flex-auto">
            <div className="h-full overflow-hidden embla"  ref={emblaRef}>
                <div className="h-full embla__container flex">
                    <div className="embla__slide flex-[0_0_100%]">
                        <div className={`overflow-hidden w-full px-10 h-full flex flex-col xl:basis-5/12 bg-white rounded-lg shadow-md p-4 `}>
                            <div className="w-full h-6 text-center">
                                <Link href={lang+'/block'} className="font-semibold text-lg">
                                Block
                                </Link>
                            </div>
                            <hr className="my-1 h-px border-1 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-50"></hr>
                            <Block lang={lang} status={true} time={time}/>
                        </div>
                    </div>
                    
                    <div className="embla__slide flex-[0_0_100%]">
                        <div className={`overflow-hidden w-full px-10 h-full flex flex-col xl:basis-5/12 bg-white rounded-lg shadow-md p-4 `}>
                            <div className="w-full h-6 text-center">
                                <Link href={lang+'/tx'} className="font-semibold text-lg">
                                Transaction
                                </Link>
                            </div>
                            <hr className="my-1 h-px border-1 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-50"></hr>
                            <Transaction lang={lang} status={true} time={time}/>
                        </div>
                    </div>
                    <div className="embla__slide flex-[0_0_100%]">Slide 3</div>
                </div>
            </div>
        </div>

        <div className="h-full w-1/12 flex justify-center items-center text-[#212529] cursor-pointer " onClick={scrollNext}>
            <FontAwesomeIcon icon={faAngleRight} className="text-5xl"/>
        </div>
        </>
    )
}