const mysql = require('mysql');
var env = process.env.NODE_ENV || 'local';
var config = require('./config.js')[env];

var con = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port
  });
  
  con.connect(function (err) {
    // if (err) throw err;
    // con.query("select * from phoenixOauth.users;", function (err, result) {
    //   if (err) throw err;
    // });
  });

module.exports = con