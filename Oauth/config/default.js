process.env['ALLOW_CONFIG_MUTATIONS'] = true;

const vault = require("../external/vault");
const asyncConfig = require('config/async').asyncConfig;
require('dotenv').config();

async function get_secret(path, name) {
    return (await vault.read(path))[name];
}

const config = {
    database: {
        host: process.env.MYSQL_IP,
        port: process.env.MYSQL_PORT,
        username: asyncConfig(get_secret("secret/data/oauth/mysql", "username")),
        password: asyncConfig(get_secret("secret/data/oauth/mysql", "password"))
    },
    jwt_secret: asyncConfig(get_secret("secret/data/oauth/jwt", "jwt_secret"))
};

module.exports = config;
