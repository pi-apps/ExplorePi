'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import clsx from 'clsx'
import { useSelectedLayoutSegment } from 'next/navigation';
import { faChartSimple, faCubes, faRankingStar, faTv, faTvAlt, faUserTag } from '@fortawesome/free-solid-svg-icons';

export default function navbar({children}){
    const segmant = useSelectedLayoutSegment()

    return(
        <>
        <div className='w-screen h-screen overflow-hidden '>            
                {children}
        </div>

        <ul className="shadow flex fixed bottom-0 justify-center w-full font-mono bg-white">
            <Link href="/pibrowser/statistic" className='w-1/4'>
                <li>
                    <button 
                    type="button" 
                    className={clsx('shadow block py-1 font-semibold text-center w-full',{
                        'text-nav-purple': segmant === "statistic",
                        'text-nav-gold': segmant !== "statistic"
                    })}>
                        <FontAwesomeIcon icon={faChartSimple} />
                        <p className='space-x-0'>Statistic</p>
                    </button>
                </li>
            </Link>
            <Link href="/pibrowser/explorer" className='w-1/4'>            
                <li >
                    <button 
                    type="button" 
                    className={clsx('shadow block py-1 font-semibold text-center w-full',{
                        'text-nav-purple': segmant === "explorer",
                        'text-nav-gold': segmant !== "explorer"
                    })}>
                        <FontAwesomeIcon icon={faCubes} />
                        <p className='space-x-0'>Explorer</p>
                    </button>
                </li>
            </Link>

            <Link href="/pibrowser/stream" className='w-1/4'>            
                <li>
                    <button 
                    type="button" 
                    className={clsx('shadow block py-1 font-semibold text-center w-full',{
                        'text-nav-purple': segmant === "stream",
                        'text-nav-gold': segmant !== "stream"
                    })}>
                        <FontAwesomeIcon icon={faTvAlt} />
                        <p>Stream</p>
                    </button>
                </li>
            </Link>

            <Link href="/pibrowser/personal" className='w-1/4'>            
                <li>
                    <button 
                    type="button" 
                    className={clsx('shadow block py-1 font-semibold text-center w-full',{
                        'text-nav-purple': segmant === "personal",
                        'text-nav-gold': segmant !== "personal"
                    })}>
                        <FontAwesomeIcon icon={faUserTag} />
                        <p>Personal</p>
                    </button>
                </li>
            </Link>
        </ul>
        </>
    )
}