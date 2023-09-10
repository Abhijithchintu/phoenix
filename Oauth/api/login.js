const jwt = require("jsonwebtoken");
const config = require('config');
const redis = require("redis");
const crypto = require('crypto');

const logger = require("../logger");
const OAuthValidationError = require("../error/OAuthValidationError");
const constants = require("../constant/constants");
const Users = require("../dao/users");
const statusCode = require("../constant/statusCode");
const jwtUtil = require("../util/jwtUtil");
const redis_client = redis.createClient();

const jwt_secret = config.get("jwt_secret");
const jwt_expiration = constants.jwt_expiration;
const jwt_refresh_expiration = constants.jwt_refresh_expiration;

redis_client.connect().then(async () => {
  redis_client.on('error', err => {
    logger.info('Error: ' + err);
  });
});

class login {

  static async login(req, res) {
    let user_id = (await login.validateLogin(req)).toString();
    let token = jwt.sign({ uid: user_id }, jwt_secret, {expiresIn: jwt_expiration});
    let refresh_token = await login.generate_refresh_token(64);
    let refresh_token_maxage = Math.floor(new Date().getTime() / 1000) + jwt_refresh_expiration;
    await redis_client.set(refresh_token,
      JSON.stringify({
          "user_id": user_id,
          "refresh_token": refresh_token,
          "expires": refresh_token_maxage
      }),
      {"EX": jwt_refresh_expiration}
    );

    return res.send({
      "access_token": token,
      "token_type": "phoenix-oauth-1.0",
      "expires_in": jwt_expiration,
      "refresh_token": refresh_token
    });
  }

  static async verify_token(req, res) {
    let user_id = (await jwtUtil.validate_and_get_body(req)).toString();
    return res.send({"valid": true});
  }

  static async validateLogin(req){
    const user = await Users.get_by_mobile_or_user_name(req.body.mobile, req.body.user_name);
    if (!user)
      throw new OAuthValidationError("OA_1017");
    if (req.body.password !== user["password"])
      throw new OAuthValidationError("OA_1001");
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
  
              let redis_token = redis_client.get(uid, function (err, val) {
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
  
                  redis_client.set(
                    decoded.uid,
                    JSON.stringify({
                      refresh_token: refresh_token,
                      expires: refresh_token_maxage
                    }),
                    
                  );
                  logger.info("client id is stored in redis database");
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
    return crypto.randomBytes(len).toString('hex');
  }
}

module.exports = login