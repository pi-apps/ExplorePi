require('dotenv').config()
const pool = require('./database');
const StellarSdk = require('stellar-sdk');
const horizon = process.env['HORIZON_URL']
// @ts-ignore
const server = new StellarSdk.Server(horizon);
let lastCursor=process.env['LEDGER_CURSOR'];

//First cursor is 8589934592(paging_token) 
let pre_time =  process.env['pre_time'];
let lastprocess
let streamer,worker

function block(){
    try{
        worker = 0
        streamer = server.ledgers()
        // @ts-ignore
        .cursor(lastCursor)
        .stream({
            onmessage: lgHandler
        })

        console.log('Block start')
    }catch(e){
        console.log(e)
    }
    return
}

function lgHandler(res){
    lastprocess=res.paging_token
    //console.log('Last : ' +lastprocess)
    let close = new Date(res.closed_at)
    // @ts-ignore
    let pre_close = new Date(pre_time)
    // @ts-ignore
    let spend_time = (close - pre_close)/1000
    pre_time = res.closed_at
    let date = res.closed_at.slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO block(id,success,fail,operation,total,fee_pool,created_at,spend) VALUES ("+
    res.sequence+","+
    res.successful_transaction_count+","+
    res.failed_transaction_count+","+
    res.operation_count+","+
    res.total_coins+","+
    res.fee_pool+",'"+
    date+"',"+
    spend_time+")"
    let string = res.paging_token+" block finished"
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}

function blockclose(){
    // @ts-ignore
    return new Promise((resolve, reject) => {
        if(worker == 0){
            resolve(lastprocess);
        }else{
            setTimeout(blockclose,1000)
        }
      });
}

function blockstreamclose(){
    streamer();
}

module.exports = {blockclose,blockstreamclose,block};
