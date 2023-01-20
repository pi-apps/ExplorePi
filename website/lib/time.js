export default function getago(date,transcript){
    const datejs = new Date(date)
    const now = Date.now()
    let result = Math.floor((now - datejs)/1000)
    if(result<60){
        return(result+" "+transcript.second)
    }else if(result>=60 && result<3600){
        result=Math.floor(result / 60)
        return(result+" "+transcript.minute)
    }else if(result>=3600 && result<86400){
        result=Math.floor(result / 3600)
        return(result+" "+transcript.hour)
    }else if(result>=86400 && result<2592000){
        result=Math.floor(result / 86400)
        return(result+" "+transcript.day)
    }else if(result>=2592000 && result<31104000){
        result=Math.floor(result / 2592000)
        return(result+" "+transcript.month)
    }else{
        result=Math.floor(result / 31104000)
        return(result+" "+transcript.year)
    }
}