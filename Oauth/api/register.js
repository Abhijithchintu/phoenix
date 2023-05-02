const jwt = require("jsonwebtoken");

const logger = require("../logger");
const con = require('../external/condb');
const validation = require("./validation");
const Users = require("../dao/users");
const constants = require("../constant/constants");
const config = require("config");


class register {
    static async register(req, res) {
        validation.validateUserRegisterRequest(req);

        //todo
        // if (await register.isExistingUserMobile(req.body.mobile)) {
        //   logger.error("Mobile number already registered");
        //   return res.send("Mobile number is already registered!");
        // }
        // if (await register.isExistingUserUserName(req.body.userName)) {
        //   logger.error("User Name already exists");
        //   return res.send("User name already exists!");
        // }
        const user = new Users(null, 1, req.body.userName, req.body.name, null, null, null, req.body.password, req.body.mobile, null, null);
        await user.insert();
        return res.send("User details added to the registry");
    }
    static createUser(userName, name, mobile, password) {
        logger.debug(" Creating User");
        con.query("INSERT into phoenixOauth.users(status, user_name, name, password, mobile) VALUES(1, ?, ?, ?, ?);", [userName.toLowerCase(), name, password, mobile], function (err, result) {
          if (err) throw err;
          return 0;
        });
    }

    static async isExistingUserMobile(mobile) {
  
        logger.debug("Checking the Registering mobile number in the database");
      
        return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=?) AND status=1 LIMIT 1;", [mobile], function (err, result) {
          if (err) throw err;
          resolve(result.length === 1);
        }));
      
    }

    static async isExistingUserUserName(userName) {
  
        logger.debug("Checking the Registering user name in the database");
      
        return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (user_name=?) AND status=1 LIMIT 1;", [userName.toLowerCase()], function (err, result) {
          
          if (err) throw err;
          resolve(result.length === 1);
        }));
      
    }

}

module.exports = register
  

  


