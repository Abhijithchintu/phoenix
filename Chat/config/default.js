process.env['ALLOW_CONFIG_MUTATIONS'] = true;

const vault = require("../external/vault");
const asyncConfig = require('config/async').asyncConfig;
require('dotenv').config();

async function get_secret(path, name) {
    return (await vault.read(path))[name];
}

const mongoose = require('mongoose')

const dbconnect = (url) => {
    return mongoose
        .connect(url)
        .then( () => console.log('db connected'))
        .catch((err) => console.log(err))
}


const config = {
    database: {
        host: process.env.MYSQL_IP,
        port: process.env.MYSQL_PORT,
        username: asyncConfig(get_secret("secret/data/chat/mysql", "username")),
        password: asyncConfig(get_secret("secret/data/chat/mysql", "password"))
    },
};

module.exports = config;
