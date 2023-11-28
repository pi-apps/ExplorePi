var mysql = require('mysql2');
const DataConnection = mysql.createPool({
    connectionLimit : 20,
    host     : process.env["DB_HOST"],
    user     : process.env["DB_USERNAME"],
    password : process.env["DB_PASSWORD"],
    database : process.env["DB_DATABASE"],
    waitForConnections: true,
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    // @ts-ignore
    port: process.env["DB_PORT"]
});  

const query = async (sql,string=null) => {
    const connection = mysql.createConnection({
        host: process.env["DB_HOST"],
        user: process.env["DB_USERNAME"],
        password : process.env["DB_PASSWORD"],
        database : process.env["DB_DATABASE"],
      });
    const result = await connection.promise().query(sql);
    connection.end();
    return result[0]
}
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
                //console.log(string)
                data(results)
            });
        });
    });
}
const disConnection = ()=>{
    DataConnection.end()
}
module.exports = { getConnection,ex_sql,disConnection,query };
