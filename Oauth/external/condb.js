const mysql = require('mysql');
const { error} = require("winston");
const config = require('config')

const get_pool = () => {
    const mysql_config = {
        host: config.get("database.host"),
        user: config.get("database.username"),
        password: config.get("database.password"),
        port: config.get("database.port")
    };
    return mysql.createPool(mysql_config);
}


module.exports = get_pool;