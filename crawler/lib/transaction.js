require('dotenv').config()
const pool = require('./database');
const StellarSdk = require('stellar-sdk');
const horizon = process.env['HORIZON_URL']
// @ts-ignore
const server = new StellarSdk.Server(horizon);
let lastCursor=process.env['TX_CURSOR'];
//First cursor is 60129546240(paging_token) 
let lastprocess
let streamer,worker
function transaction(){
    try{
        worker = 0
        streamer = server.transactions()
        // @ts-ignore
        .cursor(lastCursor)
        .stream({
            onmessage: txHandler
        })
        console.log('tx start')
    }catch(e){
        console.log(e)
    }
    return
}

function txHandler(res){
    lastprocess=res.paging_token
    //console.log('Last : ' +lastprocess)
    if(res.successful){
        let date = res.created_at.slice(0, 19).replace('T', ' ')
        let amount = (parseInt(res.fee_charged)/10000000)
        let sql = "INSERT INTO fee(id,created_at,account,amount) VALUES ('"+res.paging_token+"','"+date+"','"+res.source_account+"',"+amount+")"
        let string = res.paging_token + ' transaction finished'
        worker+=1
        // @ts-ignore
        pool.ex_sql(sql,string).then(
            // @ts-ignore
            worker-=1
        )
    }    
}
function txclose(){
    // @ts-ignore
    return new Promise((resolve, reject) => {
        if(worker == 0){
            resolve(lastprocess);
        }else{
            setTimeout(txclose,1000)
        }
      });
}
function txstreamclose(){
    streamer();
}

module.exports = {txclose,txstreamclose,transaction};