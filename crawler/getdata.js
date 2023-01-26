require('dotenv').config()
const pool = require('./lib/database');
const {db} = require('./lib/firestore')
async function getTop10(){
    let result = await pool.ex_sql(`SELECT account,balance-totalfee.total FROM piexplorer.Account 
    INNER JOIN (SELECT sum(amount) as total,account FROM piexplorer.fee group by account order by total desc) as totalfee ON  Account.public_key = totalfee.account
    where Role <> 'CoreTeam' 
    order by balance desc LIMIT 0, 10`)
    const docRef = db.collection('statistic').doc('data');
    docRef.set({
    top10: JSON.parse(JSON.stringify(result))
    });
}
getTop10()