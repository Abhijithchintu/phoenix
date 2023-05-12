const logger = require("../logger");
const con = require('../config/condb')
const OAuthValidationError = require("../error/OAuthValidationError");

class login {
  static async validateLogin(req){
    logger.debug("Validating user login details");
    var a = new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=? or user_name=?) AND status=1 LIMIT 1;", [req.body.userid, req.body.userid], function (err, result) {
      // console.log(result.length===1);
      if (err) throw err;
      console.log(result.length + " :result length");
      if(result.length === 0){
        logger.error(req.body.userid + " :userid not found in the registry");
        
      }
      return resolve(result.length === 1);
    }));
    
    
    if(await a){
      var b = new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE ((mobile=? or user_name=?) and password=?) AND status=1 LIMIT 1;", [req.body.userid, req.body.userid, req.body.password], function (err, result) {
        // console.log(result.length===1);
        if (err){
          return reject(err);
        };
        console.log(result.length + " :result length");
        if(!result.length){
          logger.error(req.body.password + " :password is incorrect");
          
        }
        else{
          console.log(result);
        }
        
        return resolve(result[0].client_id);
      })); 
    }
    else{
      throw new OAuthValidationError("userid is wrong, try again");
    }
    if(await b instanceof Error){
      throw new OAuthValidationError("Password is incorrect, try again"); 
    }
    return await b;
  }
}

module.exports = login