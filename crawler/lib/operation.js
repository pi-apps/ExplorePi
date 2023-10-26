require('dotenv').config()
const pool = require('./database');
const StellarSdk = require('stellar-sdk');
const horizon = process.env['HORIZON_URL']
// @ts-ignore
const server = new StellarSdk.Server(horizon);
let lastCursor=process.env['OP_CURSOR'];
//First cursor is 60129546240(paging_token) 
let lastprocess
function operation(){
    try{
        server.operations()
        // @ts-ignore
        .cursor(lastCursor)
        .stream({
            onmessage: opHandler
        })
    }catch(e){
        console.log(e)
    }
}
/* type_i
0:create_account
1:payment
2:path_payment_received
3:manage_sell
4:passive_sell
5:set_option
6:change_trust
7:allow_trust
8:account_merge
10:manage_data
11:bump_sequence
12:manage_buy
13:path_payment_send
14:create_claimant
15:claim_claimant
16:begin_sponsor
17:end_sponsor
19:revoke_sponsor
22:pool_deposit
23:pool_withdraw
*/
function opHandler(res){
    lastprocess=res.paging_token
    console.log('Last : ' +lastprocess)
    if(res.transaction_successful){
        let sql
        let date = res.created_at.slice(0, 19).replace('T', ' ')
        switch (res.type_i) {
            case 0:
                if(res.funder == 'GABT7EMPGNCQSZM22DIYC4FNKHUVJTXITUF6Y5HNIWPU4GA7BHT4GC5G'){
                    sql ="INSERT INTO Account(public_key,balance,created_at,Role) VALUES ('"+res.account+"',"+res.starting_balance+",'"+date+"','Pioneer')"
                }else{
                    sql ="INSERT INTO Account(public_key,balance,created_at,Role) VALUES ('"+res.account+"',"+res.starting_balance+",'"+date+"','CoreTeam')"
                }
                break;
            case 1:
                //payment
                sql = "INSERT INTO operation(id,type_i,account,created_at,amount) VALUES ('"+res.paging_token+"',"+res.type_i+",'"+res.source_account+"','"+date+"',"+res.amount+")"
                break;
            default:
                sql = "INSERT INTO operation(id,type_i,account,created_at) VALUES ('"+res.paging_token+"',"+res.type_i+",'"+res.source_account+"','"+date+"')"
                break;
        }
        
        let string = res.paging_token + ' operation finished'
         pool.ex_sql(sql,string)
    }    
}

exports.crawl = operation()