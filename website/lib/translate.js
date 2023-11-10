export function formatTrans(string,value){
    return string.replace(/{([^{}]*)}/g, 
    (a,b) =>{
      const r = value[b]
      return r
    }
    )
}