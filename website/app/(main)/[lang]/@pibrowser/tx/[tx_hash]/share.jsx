'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Share({tx_hash,lang}){

    const handleshare = () =>{
        window.Pi.openShareDialog('Share This Transaction', 'pi://'+process.env['NEXT_PUBLIC_DOMAIN']+'/tx/'+tx_hash)
    }
    return(
        <>  
        <span className="ml-3 text-purple-600">
            <FontAwesomeIcon  icon={faShareFromSquare} onClick={handleshare}/>
        </span>            
        </>
    )
}