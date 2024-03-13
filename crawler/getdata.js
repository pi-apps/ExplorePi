// @ts-nocheck
require('dotenv').config()
const pool = require('./lib/database');
const {db} = require('./lib/firestore')
const schedule = require('node-schedule');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const docRef = db.collection('statistic').doc('data');

async function getTop10(){
    let result = await pool.query(`SELECT account,(balance-totalfee.total) as balance FROM explorepi.Account 
    INNER JOIN (SELECT sum(amount) as total,account FROM explorepi.fee group by account order by total desc) as totalfee ON  Account.public_key = totalfee.account
    where Role <> 'CoreTeam' OR Role is null
    order by balance desc LIMIT 0, 10`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'top10':result})
}
async function getblocktime(){
    let result = await pool.query(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as x,avg(spend) as y,sum(operation) as op FROM explorepi.block group by DATE_FORMAT(created_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'blocktime':result})
}
async function getblocktimeMonth(){
    let result = await pool.query(`SELECT DATE_FORMAT(created_at, '%Y-%m') as x,avg(spend) as y,sum(operation) as op FROM explorepi.block group by DATE_FORMAT(created_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'blocktimeMonth':result})
}
async function getTop10payment(){
    let result = await pool.query(`SELECT count(*) as count,account FROM explorepi.operation where type_i=1 group by account order by count desc LIMIT 0, 10;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'top10payment':result})
}
async function getTop10fee(){
    let result = await pool.query(`SELECT sum(amount) as total,account FROM explorepi.fee group by account order by total desc LIMIT 0, 10;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'top10fee':result})
}
async function getopdistribute(){
    let result = await pool.query(`SELECT count(*) as total,type_i as op FROM explorepi.operation group by type_i;`)
    docRef.update({'opdistribute':result})
}
async function getclaimed(){
    let result = await pool.query(`SELECT DATE_FORMAT(claimed_at, '%Y-%m-%d') as x,count(*) as y FROM explorepi.claimant where claimed_at is not null and status=1 group by DATE_FORMAT(claimed_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'claimed':result})
}
async function getclaimedback(){
    let result = await pool.query(`SELECT DATE_FORMAT(claimed_at, '%Y-%m-%d') as x,count(*) as y FROM explorepi.claimant where claimed_at is not null and status=2 group by DATE_FORMAT(claimed_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'claimedback':result})
}
async function getclaimanthistory(){
    let result = await pool.query(`SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as x,count(*) as y FROM explorepi.claimant group by DATE_FORMAT(created_at, '%Y-%m-%d') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'createclaimant':result})
}
async function getclaimedMonth(){
    let result = await pool.query(`SELECT DATE_FORMAT(claimed_at, '%Y-%m') as x,count(*) as y FROM explorepi.claimant where claimed_at is not null and status=1 group by DATE_FORMAT(claimed_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'claimedMonth':result})
}
async function getclaimedbackMonth(){
    let result = await pool.query(`SELECT DATE_FORMAT(claimed_at, '%Y-%m') as x,count(*) as y FROM explorepi.claimant where claimed_at is not null and status=2 group by DATE_FORMAT(claimed_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'claimedbackMonth':result})
}
async function getclaimanthistoryMonth(){
    let result = await pool.query(`SELECT DATE_FORMAT(created_at, '%Y-%m') as x,count(*) as y FROM explorepi.claimant group by DATE_FORMAT(created_at, '%Y-%m') order by x asc;`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'createclaimantMonth':result})
}

async function getlockupperiod(){
    let result = await pool.query(`SELECT count(case when a.period=1209600 then 1 else null end) as no_lock, count(case when a.period>1209600 and a.period<=2419200 then 1 else null end) as twoweek, count(case when a.period>2419200 and a.period<=18187200 then 1 else null end) as sixmonths, count(case when a.period>18187200 and a.period<=33976800 then 1 else null end) as oneyear, count(case when a.period>33976800 then 1 else null end) as threeyear from(SELECT account,max(lock_time) as period FROM explorepi.claimant group by account) as a`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'lockuptime':result})
}
async function getmetric(){
    let result = await pool.query(`SELECT a.a as TotalAccount,b.a as TotalPi,c.a as TotalClaim,b.a-c.a as TotalLock,d.a as TotalPioneer from(SELECT count(*) as a FROM explorepi.Account)as a,(SELECT sum(amount) as a FROM explorepi.claimant where status<>2) as b,(SELECT sum(amount) as a FROM explorepi.claimant where status=1)as c,(SELECT count(distinct account) as a FROM explorepi.claimant)as d`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'metric':result[0]})
}
async function getdailymetric(){
    let active = await pool.query(`select count(a.account) as dailyactive from(SELECT account FROM explorepi.operation where created_at > now() - interval 24 hour group by account) as a`)
    active = await JSON.parse(JSON.stringify(active))
    let fee = await pool.query(`SELECT sum(amount) as a FROM explorepi.fee where created_at > now() - interval 24 hour`)
    fee = await JSON.parse(JSON.stringify(fee))
    let pay = await pool.query(`SELECT count(*) as dailypayment,sum(amount) as dailypipay FROM explorepi.operation where created_at > now() - interval 24 hour and type_i=1`)
    pay = await JSON.parse(JSON.stringify(pay))
    let op = await pool.query(`SELECT count(*) as a FROM explorepi.operation where created_at > now() - interval 24 hour`)
    op = await JSON.parse(JSON.stringify(op))
    let result ={
        active:active[0].dailyactive,
        fee:fee[0].a,
        pay:pay[0].dailypayment,
        payamount:pay[0].dailypipay,
        op:op[0].a
    }
    docRef.update({'daily':result})
}
async function getunlocknotclaimed(){
    let result = await pool.query(`SELECT sum(amount) as a FROM explorepi.claimant where unlock_time < now() and status = 0`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'unlocknotclaimed':result[0].a})
}
async function getavailablepi(){
    let result = await pool.query(`SELECT (a.a - b.a) AS a FROM (SELECT SUM(balance) AS a FROM explorepi.Account )AS a,(SELECT SUM(amount) AS a FROM explorepi.fee AS b)AS b`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'availablepi':result[0].a})
}
async function getfutureunlock(){
    let result = await pool.query(`SELECT DATE_FORMAT(unlock_time, '%Y-%m-%d') as x,count(*) as y,sum(amount) as amount FROM explorepi.claimant where unlock_time > now() group by DATE_FORMAT(unlock_time, '%Y-%m-%d') order by x asc`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'futureUnlock':result})
}
async function getfutureunlockMonth(){
    let result = await pool.query(`SELECT DATE_FORMAT(unlock_time, '%Y-%m') as x,count(*) as y,sum(amount) as amount FROM explorepi.claimant where unlock_time > now() group by DATE_FORMAT(unlock_time, '%Y-%m') order by x asc`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'futureUnlockMonth':result})
}
async function getoneyearunclaimed(){
    let result = await pool.query(`SELECT sum(amount) as a FROM explorepi.claimant where status = 0 and unlock_time< date_sub(now(),INTERVAL 1 YEAR)`)
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'oneyearunclaimed':result[0].a})
}
async function getholderrank(){
    let result = await pool.query("select case when balance >= 0 and balance <= 1 then '0-1' when balance > 1 and balance <= 10 then '1-10' when balance > 10 and balance <= 100 then '10-100' when balance > 100 and balance <= 500 then '100-500' when balance > 500 and balance <= 1000 then '500-1,000' when balance > 1000 and balance <= 5000 then '1,000-5,000' when balance > 5000 and balance <= 10000 then '5,000-10,000' when balance > 10000 and balance <= 100000 then '10,000-100,000' when balance > 100000 and balance <= 1000000 then '100,000-1,000,000' else '>1,000,000' end as 'range', count(*) as `result` from Account where Role = 'Pioneer' group by `range` order by `range`")
    result = await JSON.parse(JSON.stringify(result))
    docRef.update({'rank':result})
}

async function statistic(){
    await getTop10()
    await getblocktime() 
    await getTop10payment()
    await getTop10fee()
    await getopdistribute()
    await getclaimed()
    await getclaimedback()
    await getclaimanthistory()
    await getclaimedMonth()
    await getclaimedbackMonth()
    await getclaimanthistoryMonth()
    await getblocktimeMonth()
    await getlockupperiod()
    await getmetric()
    await getdailymetric()
    await getunlocknotclaimed()
    await getavailablepi()
    await getfutureunlock()
    await getfutureunlockMonth()
    await getoneyearunclaimed()
    await getholderrank()
    docRef.update({
        timestamp: Date.now()
        });
}

const start = () => {
    console.log('Getdata start')
    statistic()
    const job = schedule.scheduleJob('0 * * * *', function(){
        statistic()
    });

    const rl = readline.createInterface({ input, output });

    rl.question('Press q to exit\n', (answer) => {
      // TODO: Log the answer in a database
      if (answer === 'q'){
        job.cancel();
      }
      rl.close();
      
    });
}

start();