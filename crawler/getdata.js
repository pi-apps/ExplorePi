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
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as x,avg(spend) as y FROM piexplorer.block group by DATE_FORMAT(created_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}

async function statistic(){
    let top10 = await getTop10()
    let blocktime = await getblocktime() 
    const docRef = db.collection('statistic').doc('data');
    await docRef.set({
        top10: top10,
        blocktime:blocktime,
        timestamp: Date.now()
        });
    process.exit(0);
}
statistic()