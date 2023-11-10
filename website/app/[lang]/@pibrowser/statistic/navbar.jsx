'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import clsx from 'clsx'
import {  usePathname  } from 'next/navigation';
import { faChartSimple, faCubes, faTvAlt, faUserTag } from '@fortawesome/free-solid-svg-icons';
import Script from 'next/script';
export default function NavBar({ transcript,lang }){
    const segmant = 'statistic'
    const scopes = ['username', 'payments','wallet_address'];
    function onIncompletePaymentFound(payment) {
    };
    const handleScript = ()=>{
        if(process.env['NEXT_PUBLIC_SANDBOX']=='true')
        Pi.init({ version:'2.0', sandbox: true})
        else
        Pi.init({ version:'2.0' })
        Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
            console.log(auth);
          })
      }
    return(
        <>
        <Script src="https://sdk.minepi.com/pi-sdk.js" onLoad={handleScript}/>
        <ul className="shadow flex fixed bottom-0 justify-center w-full font-mono overflow-hidden bg-white">
            <Link href={`/${lang}/statistic`} className='w-1/4'>
                <li>
                    <button 
                    type="button" 
                    className={clsx('whitespace-nowrap shadow block py-1 font-semibold text-center w-full overflow-hidden',{
                        'text-nav-purple': segmant === "statistic",
                        'text-nav-gold': segmant !== "statistic"
                    })}>
                        <FontAwesomeIcon icon={faChartSimple} />
                        <p className='space-x-0'>{transcript.Statistic}</p>
                    </button>
                </li>
            </Link>
            <Link href={`/${lang}/explorer`} className='w-1/4'>            
                <li >
                    <button 
                    type="button" 
                    className={clsx('whitespace-nowrap shadow block py-1 font-semibold text-center w-full overflow-hidden',{
                        'text-nav-purple': segmant === "explorer",
                        'text-nav-gold': segmant !== "explorer"
                    })}>
                        <FontAwesomeIcon icon={faCubes} />
                        <p className='space-x-0'>{transcript.Explorer}</p>
                    </button>
                </li>
            </Link>

            <Link href={`/${lang}/stream`} className='w-1/4'>            
                <li>
                    <button 
                    type="button" 
                    className={clsx('shadow block py-1 whitespace-nowrap font-semibold text-center w-full overflow-hidden',{
                        'text-nav-purple': segmant === "stream",
                        'text-nav-gold': segmant !== "stream"
                    })}>
                        <FontAwesomeIcon icon={faTvAlt} />
                        <p>{transcript.Stream}</p>
                    </button>
                </li>
            </Link>

            <Link href={`/${lang}/personal`} className='w-1/4'>            
                <li>
                    <button 
                    type="button" 
                    className={clsx('whitespace-nowrap shadow block py-1 font-semibold text-center w-full overflow-hidden',{
                        'text-nav-purple': segmant === "personal",
                        'text-nav-gold': segmant !== "personal"
                    })}>
                        <FontAwesomeIcon icon={faUserTag} />
                        <p>{transcript.Personal}</p>
                    </button>
                </li>
            </Link>
        </ul>
        </>
    )
}