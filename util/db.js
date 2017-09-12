var dbhost = "hzzmdata.mysql.rds.aliyuncs.com";
var dbuser = "mm_root";
var dbdatabase = "kingcard";
var dbpassword = "NBgiuDrKc9eXNjj0zllo";
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    database: dbdatabase
});

module.exports = pool;