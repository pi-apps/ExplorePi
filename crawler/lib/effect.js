require('dotenv').config()
const pool = require('./database')  
const StellarSdk = require('stellar-sdk');
const horizon = process.env['HORIZON_URL']
// @ts-ignore
const server = new StellarSdk.Server(horizon);
let lastCursor=process.env['EFFECT_CURSOR']; 

let lastprocess
let streamer,worker

async function crawl(){    
    try{
        worker = 0
        streamer =server.effects()
        // @ts-ignore
        .cursor(lastCursor)
        .stream({
            onmessage: effectHandler
        })
        console.log('effect start')
    }catch(e){
        console.log(lastCursor)
    }
    return
}


function credit_sql(res){
    let sql
    if(res.asset_type=='native'){
        sql = "UPDATE Account SET balance = balance + " + res.amount +" WHERE public_key = '"+ res.account +"'"
    }else{
        sql = "UPDATE asset SET balance = balance + " + res.amount + " WHERE public_key = '"+ res.account +"' AND asset_code = '"+res.asset_code + "' AND asset_issuer = '"+res.asset_issuer +"'"
    }
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function debit_sql(res){
    let sql
    if(res.asset_type=='native'){
        sql = "UPDATE Account SET balance = balance - " + res.amount +" WHERE public_key = '"+ res.account +"'"
    }else{
        sql = "UPDATE asset SET balance = balance - " + res.amount + " WHERE public_key = '"+ res.account +"' AND asset_code = '"+res.asset_code + "' AND asset_issuer = '"+res.asset_issuer +"'"
    }
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function removed_account(res){
    let sql = "DELETE FROM account WHERE public_key= '"+ res.account +"'"
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function lock_sql(res){
    let sql = "UPDATE Account SET lock=1 WHERE public_key = '"+ res.account +"'"
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function trustline_create_sql(res){
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO asset(public_key,asset_code,asset_issuer,created_at) VALUES ('"+res.account+"','"+res.asset_code+"','"+res.asset_issuer+"','"+date+"')"
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function trustline_remove_sql(res){
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    let sql = "UPDATE asset SET removed = 1 ,removed_at = '"+date+"' WHERE id = (SELECT MIN(id) FROM asset WHERE public_key = '"+res.account+"' AND asset_code = '"+res.asset_code+"' AND asset_issuer = '"+res.asset_issuer+"' AND removed = 0)"
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function claimable_balance_create_sql(res){
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO claimant(id,created_at,amount) VALUES ('"+res.balance_id+"','"+date+"',"+res.amount+") ON DUPLICATE KEY UPDATE created_at=VALUES(created_at),amount=VALUES(amount)"
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function claimant_create_sql(res){
    let lock_time = parseInt(res.predicate.not.rel_before)
    let date = new Date(res.created_at)
    let unlock_time = date.getSeconds() + lock_time
    date.setSeconds(unlock_time)
    // @ts-ignore
    unlock_time = date.toISOString().slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO claimant(id,account,lock_time,unlock_time) VALUES ('"+res.balance_id+"','"+res.account+"',"+lock_time+",'"+unlock_time+"') ON DUPLICATE KEY UPDATE account=VALUES(account),lock_time=VALUES(lock_time),unlock_time=VALUES(unlock_time)"
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}
function claim_claimant(res){
    let sql;
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    if(res.account === "GC5RNDCRO6DDM7NZDEMW3RIN5K6AHN6GMWSZ5SAH2TRJLVGQMB2I3BNJ"){
        //STATUS 2 CT clawback
        sql = "UPDATE claimant SET status = 2,claimed_at = '"+date+"' WHERE id='"+res.balance_id+"'"
    }else{
        sql = "UPDATE claimant SET status = 1,claimed_at = '"+date+"' WHERE id='"+res.balance_id+"'"
    }
    let string = res.paging_token + ' effect finished'
    worker+=1
    // @ts-ignore
    pool.ex_sql(sql,string).then(
        // @ts-ignore
        worker-=1
    )
}

const effectHandler = function (effResponse) {
    
    lastprocess=effResponse.paging_token
    //console.log('Last : ' +lastprocess)
    switch(effResponse.type_i){
        case 0:
            //account_created
          break;
        case 0:
            removed_account(effResponse)
            //account_removed
          break;
        case 2:
            //account_credited
            credit_sql(effResponse)
            break;
        case 3:
            //account_debited
            debit_sql(effResponse)
            break;
        case 11:
            //signer_removed
            if(effResponse.account === effResponse.public_key)
                lock_sql(effResponse)
            else
                break
            break
        case 20:
            //trustline_created
            trustline_create_sql(effResponse)
            break;
        case 21:
            //trustline_removed
            trustline_remove_sql(effResponse)
            break;
        case 50:
            //claimable_balance_created
            claimable_balance_create_sql(effResponse)
            break;
        case 51:
            //claimant_created
            if(effResponse.account==="GC5RNDCRO6DDM7NZDEMW3RIN5K6AHN6GMWSZ5SAH2TRJLVGQMB2I3BNJ")
            break;
            claimant_create_sql(effResponse)
            break;
        case 52:
            //claimable_balance_claimed
            claim_claimant(effResponse)
            break;
        default:
         break;
    }

}

function effectclose() {
    // @ts-ignore
    return new Promise((resolve, reject) => {
    if(worker == 0){
        resolve(lastprocess);
    }else{
        console.log(worker)
        setTimeout(effectclose,1000)
    }
  });
}

function effectstreamclose(){
    streamer();
}

module.exports = {effectclose,effectstreamclose,crawl};