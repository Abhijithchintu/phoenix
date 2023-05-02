const jwt = require("jsonwebtoken");
const config = require('config');
const redis = require("redis");

const logger = require("../logger");
const OAuthValidationError = require("../error/OAuthValidationError");
const constants = require("../constant/constants");
const Users = require("../dao/users");
const statusCode = require("../constant/statusCode");
const redis_client = redis.createClient();

const jwt_secret = config.get("jwt_secret");
const jwt_expiration = constants.jwt_expiration;
const jwt_refresh_expiration = constants.jwt_refresh_expiration;

redis_client.connect().then(async () => {
  redis_client.on('error', err => {
    console.log('Error ' + err);
    logger.info("Error is her");
  });
});

class login {

  static async login(req, res) {
    let user_id = await login.validateLogin(req);
    logger.info("login details validated");

    let refresh_token = login.generate_refresh_token(64);
    let refresh_token_maxage = new Date() + jwt_refresh_expiration;

    let token = jwt.sign({ uid: user_id }, jwt_secret, {
      expiresIn: jwt_expiration
    });

    res.cookie("access_token", token, {
      httpOnly: true
    });
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true
    });

    let uid = JSON.stringify(user_id);
    console.log("here is the string for redis", JSON.stringify({
      refresh_token: refresh_token,
      expires: refresh_token_maxage
    }));
    await redis_client.set(uid, JSON.stringify({
          refresh_token: refresh_token,
          expires: refresh_token_maxage
        }), function (err, result) {
          if (err) throw (err);
          console.log(result);
        }
    );

    var siftvalue = await redis_client.get(uid);
    console.log(siftvalue, " here it is");
    return res.send(" You have successfully logged in");
  }

  static async validateLogin(req){
    const user = await Users.get_by_mobile_or_user_name(req.body.mobile, req.body.user_name);
    if (!user)
      throw new OAuthValidationError("OALOV_1017");
    if (req.body.password !== user["password"])
      throw new OAuthValidationError("OALOV_1001");
    return user["client_id"];
  }

  static async profile(req, res) {
    login.validate_jwt(req, res).then(result => {
      console.log("You have successfully logged in with Authentication and Authorization. <3");
      res.send("you are in profile page")
    })
        .catch(error => {
          throw error;
        });
  }

  static async validate_jwt(req, res) {
    return new Promise((resolve, reject) => {
      let accesstoken = req.cookies.access_token || null;
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
  
                  let refresh_token = login.generate_refresh_token(64);
  
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