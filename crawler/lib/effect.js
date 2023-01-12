require('dotenv').config()
const pool = require('./database')  
const StellarSdk = require('stellar-sdk');
const horizon = process.env['HORIZON_URL']
// @ts-ignore
const server = new StellarSdk.Server(horizon);
let lastCursor=process.env['EFFECT_CURSOR']; 
let first_account = process.env['FIRST_ACCOUNT']
let first_sql = "INSERT INTO Account(public_key,balance,Role) VALUES ('"+first_account+"',100000000000,'CoreTeam')"
let query_first_sql = "SELECT COUNT(*) FROM Account WHERE public_key = '"+first_account+"' and balance = 100000000000 and Role = 'CoreTeam'"

async function crawl(){
    try{
        let results = pool.ex_sql(query_first_sql)

        if (results === 0) {
            pool.ex_sql(first_sql)//init memo:should add in init
        }

        query_ledger()
    }catch(e){
        console.log(lastCursor)
    }
}
const effectHandler = function (effResponse) {
    console.log(effResponse.paging_token + ' effect start')    
    switch(effResponse.type_i){
        case 0:
            //account_created
            account_sql(effResponse.account,effResponse.created_at,effResponse.starting_balance)
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
                lock_sql(effResponse.account)
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
    console.log(effResponse.paging_token + ' effect finished')
}
function query_ledger(){
    server.effects()
    // @ts-ignore
    .cursor(lastCursor)
    .stream({
        onmessage: effectHandler
    })
}

function account_sql(key,create_date,balance){
    let date = create_date.slice(0, 19).replace('T', ' ')
    let sql
    if(balance==2000001.0000000 || balance == 2000000.2000000){
        sql = "INSERT INTO Account(public_key,balance,created_at,Role) VALUES ('"+key+"',"+balance+",'"+date+"','CoreTeam')"
    }else{
     sql = "INSERT INTO Account(public_key,balance,created_at) VALUES ('"+key+"',"+balance+",'"+date+"')"
    }    
    pool.ex_sql(sql)
}
function credit_sql(res){
    let sql
    if(res.asset_type=='native'){
        sql = "UPDATE Account SET balance = balance + " + res.amount +" WHERE public_key = '"+ res.account +"'"
    }else{
        sql = "UPDATE asset SET balance = balance + " + res.amount + " WHERE public_key = '"+ res.account +"' AND asset_code = '"+res.asset_code + "' AND asset_issuer = '"+res.asset_issuer +"'"
    }
    pool.ex_sql(sql)
}
function debit_sql(res){
    let sql
    if(res.asset_type=='native'){
        sql = "UPDATE Account SET balance = balance - " + res.amount +" WHERE public_key = '"+ res.account +"'"
    }else{
        sql = "UPDATE asset SET balance = balance - " + res.amount + " WHERE public_key = '"+ res.account +"' AND asset_code = '"+res.asset_code + "' AND asset_issuer = '"+res.asset_issuer +"'"
    }
    pool.ex_sql(sql)
}
function lock_sql(key){
    let sql = "UPDATE Account SET lock=1 WHERE public_key = '"+ key +"'"
    pool.ex_sql(sql)
}
function trustline_create_sql(res){
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO asset(public_key,asset_code,asset_issuer,created_at) VALUES ('"+res.account+"','"+res.asset_code+"','"+res.asset_issuer+"','"+date+"')"
    pool.ex_sql(sql)
}
function trustline_remove_sql(res){
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    let sql = "UPDATE asset SET removed = 1 ,removed_at = '"+date+"' WHERE id = (SELECT MIN(id) FROM asset WHERE public_key = '"+res.account+"' AND asset_code = '"+res.asset_code+"' AND asset_issuer = '"+res.asset_issuer+"' AND removed = 0)"
    pool.ex_sql(sql)
}
function claimable_balance_create_sql(res){
    let date = res.created_at.slice(0, 19).replace('T', ' ')
    let sql = "INSERT INTO claimant(id,created_at,amount) VALUES ('"+res.balance_id+"','"+date+"',"+res.amount+") ON DUPLICATE KEY UPDATE created_at=VALUES(created_at),amount=VALUES(amount)"
    pool.ex_sql(sql)
}
function claimant_create_sql(res){
    let lock_time = parseInt(res.predicate.not.rel_before)
    let sql = "INSERT INTO claimant(id,account,lock_time) VALUES ('"+res.balance_id+"','"+res.account+"',"+lock_time+") ON DUPLICATE KEY UPDATE account=VALUES(account),lock_time=VALUES(lock_time)"
    pool.ex_sql(sql)
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
    pool.ex_sql(sql)
}
exports.crawl = crawl()