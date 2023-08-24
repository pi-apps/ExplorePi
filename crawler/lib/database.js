var mysql = require('mysql2');
const DataConnection = mysql.createPool({
    connectionLimit : 100,
    host     : 'ls-914880a4f6a8babf7f4b1c97b2673ca8ee322cd8.csqahcuj4wfc.us-east-2.rds.amazonaws.com',
    user     : process.env["DB_USERNAME"],
    password : ':fezUD[8~(_Rp4fs#WUo6L0,x-`eFs2f',
    database : 'explorepi',
    waitForConnections: true,
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // @ts-ignore
    port: process.env["DB_PORT"]
});
function getConnection(callback) {
    DataConnection.getConnection(function(err, connection) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        callback(err, connection);
        }
    )
}
function ex_sql(sql,string=null){
    return new Promise(data => {
        getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(sql, function (error, results, fields) {
                connection.release();
                if (error) throw error;
                if(string)
                console.log(string)
                data(results)
            });
        });
    });
}
const disConnection = ()=>{
    DataConnection.end()
}
module.exports = { getConnection,ex_sql,disConnection };