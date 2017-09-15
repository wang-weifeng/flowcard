var dbhost = "127.0.0.1";
var dbuser = "root";
var dbdatabase = "kingcard";
var dbpassword = "12456";
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase
});

module.exports = pool;