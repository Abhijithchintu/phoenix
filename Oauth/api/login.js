const logger = require("../logger");
const con = require('../config/condb')
const OAuthValidationError = require("../error/OAuthValidationError");
const jwt = require("jsonwebtoken");
const jwt_secret = "jwtfanhere";
const jwt_expiration = 60 * 10;
const jwt_refresh_expiration = 60 * 60 * 24 * 30;

class login {
  static async validateLogin(req){
    logger.debug("Validating user login details");
    var a = new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=? or user_name=?) AND status=1 LIMIT 1;", [req.body.userid, req.body.userid], function (err, result) {
      // console.log(result.length===1);
      if (err) throw err;
      if(result.length === 0){
        logger.error(req.body.userid + " :userid not found in the registry");
      }
      return resolve(result.length === 1);
    }));
    
    if(await a){
    var b = new Promise((resolve, reject) => con.query("SELECT * FROM phoenixOauth.users WHERE ((mobile=? or user_name=?) and password=?) AND status=1 LIMIT 1;", [req.body.userid, req.body.userid, req.body.password], function (err, result) {
        if (err) throw err;
        if(!result.length){
          logger.error("password is incorrect");
        }
        return resolve(result);
      })); 
    }
    else{
      throw new OAuthValidationError("userid is wrong, try again");
    }
    if(!(await b)){
      throw new OAuthValidationError("Password is incorrect, try again"); 
    }
    return b; //raks forgot to return sql query just passing nothing from here before and reading user id there
  }
  static async validate_jwt(req, res) {
    return new Promise((resolve, reject) => {
      let accesstoken = req.cookies.access_token || null;
      console.log(accesstoken, " access token is here");
      let refreshtoken = req.cookies.refresh_token || null;
  
      if (accesstoken && refreshtoken) {
  
        jwt.verify(accesstoken, jwt_secret, async function (err, decoded) {
  
          if (err) {
  
            if (err.name === "TokenExpiredError") {
  
              let redis_token = rediscl.get(uid, function (err, val) {
                return err ? null : val ? val : null;
              });
  
              if (
                !redis_token ||
                redis_token.refresh_token === refreshtoken
              ) {
  
                reject("Nice try ;-)");
              } else {
  
                
                if (redis_token.expires > new Date()) {
  
                  let refresh_token = generate_refresh_token(64);
  
                  res.cookie("__refresh_token", refresh_token, {
                    httpOnly: true
                  });
  
                  let refresh_token_maxage = new Date() + jwt_refresh_expiration;
  
                  rediscl.set(
                    decoded.uid,
                    JSON.stringify({
                      refresh_token: refresh_token,
                      expires: refresh_token_maxage
                    }),
                    rediscl.print
                  );
                }
  
                let token = jwt.sign({ uid: decoded.uid }, jwt_secret, {
                  expiresIn: jwt_expiration
                });
  
                
                res.cookie("__access_token", token, {
                  httpOnly: true
                });
  
                
                resolve({
                  res: res,
                  req: req
                });
              }
            } else {
  
              reject(err);
            }
          } else {
  
            resolve({
              res: res,
              req: req
            });
          }
        });
      } else {
  
        reject("Token missing.")
      };
    });
  }

  static async generate_refresh_token(len) {
    var text = "";
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
  
    return text;
  }
}

module.exports = login