require('dotenv').config()
const pool = require('./lib/database');
const {db} = require('./lib/firestore')
async function getTop10(){
    let result = await pool.ex_sql(`SELECT account,(balance-totalfee.total) as balance FROM piexplorer.Account 
    INNER JOIN (SELECT sum(amount) as total,account FROM piexplorer.fee group by account order by total desc) as totalfee ON  Account.public_key = totalfee.account
    where Role <> 'CoreTeam' 
    order by balance desc LIMIT 0, 10`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getblocktime(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as x,avg(spend) as y,sum(operation) as op FROM piexplorer.block group by DATE_FORMAT(created_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getTop10payment(){
    let result = await pool.ex_sql(`SELECT count(*) as count,account FROM piexplorer.operation where type_i=1 group by account order by count desc LIMIT 0, 10;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getTop10fee(){
    let result = await pool.ex_sql(`SELECT sum(amount) as total,account FROM piexplorer.fee group by account order by total desc LIMIT 0, 10;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getopdistribute(){
    let result = await pool.ex_sql(`SELECT count(*) as total,type_i as op FROM piexplorer.operation group by type_i;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getclaimed(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(claimed_at, '%Y-%m-%d') as x,count(*) as y FROM piexplorer.claimant where claimed_at is not null and status=1 group by DATE_FORMAT(claimed_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getclaimedback(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(claimed_at, '%Y-%m-%d') as x,count(*) as y FROM piexplorer.claimant where claimed_at is not null and status=2 group by DATE_FORMAT(claimed_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getclaimanthistory(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as x,count(*) as y FROM piexplorer.claimant group by DATE_FORMAT(created_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function statistic(){
    let top10 = await getTop10()
    let blocktime = await getblocktime() 
    let top10payment = await getTop10payment()
    let top10fee = await getTop10fee()
    let opdistribute = await getopdistribute()
    let claimed = await getclaimed()
    let claimedback = await getclaimedback()
    let createclaimant = await getclaimanthistory()
    const docRef = db.collection('statistic').doc('data');
    await docRef.set({
        top10: top10,
        blocktime:blocktime,
        top10payment:top10payment,
        top10fee:top10fee,
        opdistribute:opdistribute,
        claimed:claimed,
        claimedback:claimedback,
        createclaimant:createclaimant,
        timestamp: Date.now()
        });
    process.exit(0);
}
statistic()