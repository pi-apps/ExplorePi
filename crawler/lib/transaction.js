require('dotenv').config()
const pool = require('./database');
const StellarSdk = require('stellar-sdk');
const horizon = process.env['HORIZON_URL']
// @ts-ignore
const server = new StellarSdk.Server(horizon);
let lastCursor=process.env['TX_CURSOR'];
//First cursor is 60129546240(paging_token) 
let lastprocess
function transaction(){
    try{
        server.transactions()
        // @ts-ignore
        .cursor(lastCursor)
        .stream({
            onmessage: txHandler
        })
    }catch(e){
        console.log(e)
    }
}

function txHandler(res){
    lastprocess=res.paging_token
    console.log('Last : ' +lastprocess)
    if(res.successful){
        let date = res.created_at.slice(0, 19).replace('T', ' ')
        let amount = (parseInt(res.fee_charged)/10000000)
        let sql = "INSERT INTO fee(id,created_at,account,amount) VALUES ('"+res.paging_token+"','"+date+"','"+res.source_account+"',"+amount+")"
        let string = res.paging_token + ' transaction finished'
        pool.ex_sql(sql,string)
    }    
}

exports.crawl = transaction()