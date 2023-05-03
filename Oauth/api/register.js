const jwt = require("jsonwebtoken");

const logger = require("../logger");
const con = require('../external/condb');
const validation = require("./validation");
const Users = require("../dao/users");
const constants = require("../constant/constants");
const config = require("config");


class register {
    static async register(req) {
        validation.validate_user_register_request(req);
        await validation.validate_if_user_exists(req)
        const user = await Users.create_new_user(req.body.user_name, req.body.gender, req.body.name, req.body.password,
            req.body.mobile, req.body.dob);
    }
}

module.exports = register
  

  


