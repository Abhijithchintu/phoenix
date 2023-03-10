const logger = require("../logger");
const con = require('../config/condb')

  
class register{
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
  

  


