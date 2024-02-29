require('dotenv').config()
let block = require('./lib/block');
let effect = require('./lib/effect');
let operation = require('./lib/operation');
let tx = require('./lib/transaction');
const fs = require('fs') 
const pool = require('./lib/database');


const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { exit } = require('process');

const stop = async () => {
    console.log("Start shutting."); 
    block.blockstreamclose();
    effect.effectstreamclose();
    operation.opstreamclose();
    tx.txstreamclose();
    console.log("Close stream."); 
  let blockstatus = await block.blockclose()
  console.log("block complete"); 
  let effectstatus = await effect.effectclose()
  console.log("effect complete"); 
  let opstatus = await operation.operationclose()
  console.log("operation complete"); 
  let txstatus = await tx.txclose()
  console.log("tx complete"); 
  fs.writeFile('last.txt', 'Block = '+blockstatus + '\n' +'Effect = '+ effectstatus + '\n' +'Operation = '+ opstatus + '\n' +'TX = '+ txstatus, (err) => { 
    if(err) { 
    throw err; }
    console.log("Data has been written to file successfully.");
    process.exit(1)
}); 
}

const start = async () => {
    console.log('Crawler start')
    const first_account = process.env['FIRST_ACCOUNT']
    const first_sql =  "INSERT INTO Account(public_key,balance,Role) VALUES ('"+first_account+"',100000000000,'CoreTeam')"
    const query_first_sql = "SELECT COUNT(*) as count FROM Account WHERE public_key = '"+first_account+"' and Role = 'CoreTeam'"
    let results = await pool.query(query_first_sql)
    if (results[0].count === 0) {
        console.log('init')
        await pool.query(first_sql,"first init")//init memo:should add in init
    }
     block.block()
     effect.crawl()
     operation.operation()
     tx.transaction()
    console.log('Crawler is working')
    const rl = readline.createInterface({ input, output });

    rl.question('Press q to exit\n', (answer) => {
      // TODO: Log the answer in a database
      if (answer === 'q'){
        stop()
        rl.close();
      }      
    });
}



start()
