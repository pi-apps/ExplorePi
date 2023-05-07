require('dotenv').config()
const pool = require('./lib/database');
const {db} = require('./lib/firestore')

async function getTop10(){
    let result = await pool.ex_sql(`SELECT account,(balance-totalfee.total) as balance FROM piexplorer.Account 
    INNER JOIN (SELECT sum(amount) as total,account FROM piexplorer.fee group by account order by total desc) as totalfee ON  Account.public_key = totalfee.account
    where Role <> 'CoreTeam' OR Role is null
    order by balance desc LIMIT 0, 10`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getblocktime(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as x,avg(spend) as y,sum(operation) as op FROM piexplorer.block group by DATE_FORMAT(created_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getblocktimeMonth(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(created_at, '%Y-%m') as x,avg(spend) as y,sum(operation) as op FROM piexplorer.block group by DATE_FORMAT(created_at, '%Y-%m') order by x asc;`)
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
async function getclaimedMonth(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(claimed_at, '%Y-%m') as x,count(*) as y FROM piexplorer.claimant where claimed_at is not null and status=1 group by DATE_FORMAT(claimed_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getclaimedbackMonth(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(claimed_at, '%Y-%m') as x,count(*) as y FROM piexplorer.claimant where claimed_at is not null and status=2 group by DATE_FORMAT(claimed_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getclaimanthistoryMonth(){
    let result = await pool.ex_sql(`SELECT DATE_FORMAT(created_at, '%Y-%m') as x,count(*) as y FROM piexplorer.claimant group by DATE_FORMAT(created_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}

async function getlockupperiod(){
    let result = await pool.ex_sql(`SELECT count(case when a.period=1209600 then 1 else null end) as no_lock, count(case when a.period>1209600 and a.period<=2419200 then 1 else null end) as twoweek, count(case when a.period>2419200 and a.period<=18187200 then 1 else null end) as sixmonths, count(case when a.period>18187200 and a.period<=33976800 then 1 else null end) as oneyear, count(case when a.period>33976800 then 1 else null end) as threeyear from(SELECT account,max(lock_time) as period FROM piexplorer.claimant group by account) as a`)
    result = await JSON.parse(JSON.stringify(result))
    return result
}
async function getmetric(){
    let result = await pool.ex_sql(`SELECT a.a as TotalAccount,b.a as TotalPi,c.a as TotalClaim,b.a-c.a as TotalLock from(SELECT count(*) as a FROM piexplorer.Account)as a,(SELECT sum(amount) as a FROM piexplorer.claimant where status<>2) as b,(SELECT sum(amount) as a FROM piexplorer.claimant where status=1)as c`)
    result = await JSON.parse(JSON.stringify(result))
    return result[0]
}
async function getdailymetric(){
    let active = await pool.ex_sql(`select count(a.account) as dailyactive from(SELECT account FROM piexplorer.operation where created_at > now() - interval 24 hour group by account) as a`)
    active = await JSON.parse(JSON.stringify(active))
    let fee = await pool.ex_sql(`SELECT sum(amount) as a FROM piexplorer.fee where created_at > now() - interval 24 hour`)
    fee = await JSON.parse(JSON.stringify(fee))
    let pay = await pool.ex_sql(`SELECT count(*) as dailypayment,sum(amount) as dailypipay FROM piexplorer.operation where created_at > now() - interval 24 hour and type_i=1`)
    pay = await JSON.parse(JSON.stringify(pay))
    let op = await pool.ex_sql(`SELECT count(*) as a FROM piexplorer.operation where created_at > now() - interval 24 hour`)
    op = await JSON.parse(JSON.stringify(op))
    let result ={
        active:active[0].dailyactive,
        fee:fee[0].a,
        pay:pay[0].dailypayment,
        payamount:pay[0].dailypipay,
        op:op[0].a
    }
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
    let claimedMonth = await getclaimedMonth()
    let claimedbackMonth = await getclaimedbackMonth()
    let createclaimantMonth = await getclaimanthistoryMonth()
    let blocktimeMonth = await getblocktimeMonth()
    let lockuptime = await getlockupperiod()
    let metric = await getmetric()
    let daily = await getdailymetric()
    const docRef = db.collection('statistic').doc('data');
    await docRef.set({
        top10: top10,
        blocktime:blocktime,
        blocktimeMonth:blocktimeMonth,
        top10payment:top10payment,
        top10fee:top10fee,
        opdistribute:opdistribute,
        claimed:claimed,
        claimedback:claimedback,
        claimedMonth:claimedMonth,
        claimedbackMonth:claimedbackMonth,
        createclaimantMonth:createclaimantMonth,
        createclaimant:createclaimant,
        lockuptime:lockuptime,
        metric:metric,
        daily:daily,
        timestamp: Date.now()
        });
}
setInterval(statistic,21600000)