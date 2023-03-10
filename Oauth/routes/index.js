const path = require('path');

const constants = require('../config/constants');
var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config.js')[env];

const PORT = process.env.PORT || "3000";
var validation = require("../api/validation");
const logger = require("../logger");

const OAuthValidationError = require("../error/OAuthValidationError");

const register = require("../api/register")
const login = require("../api/login");

const jwt_secret = "jwtfanhere";
const jwt_expiration = 60 * 10;
const jwt_refresh_expiration = 60 * 60 * 24 * 30;

const redis = require("redis");
const jwt = require("jsonwebtoken");

var rediscl = redis.createClient();

rediscl.connect().then(async () => {
  rediscl.on('error', err => {
    console.log('Error ' + err);
    logger.info("Error is here");
  });
});

router.use(express.urlencoded({ extended: true })); //bodyparser
router.use(express.json());


router.get('/test', (req, res, next) => {
  res.send('Hello World!');
  next();
})

router.use(express.static(path.resolve(__dirname, '../../phoenixfe/build')));
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../phoenixfe/build', 'index.html'));
});

router.post('/register', async (req, res) => {

  logger.debug("This is Registration route");

  try {
    validation.validateUserRegisterRequest(req);
  } catch (error) {
    logger.error("This is Registration error", error);
    return res.send(error.message);
  }

  if (await register.isExistingUserMobile(req.body.mobile)) {
    logger.error("Mobile number already registered");
    return res.send("Mobile number is already registered!");
  }
  if (await register.isExistingUserUserName(req.body.userName)) {
    logger.error("User Name already exists");
    return res.send("User name already exists!");
  }
  register.createUser(req.body.userName, req.body.name, req.body.mobile, req.body.password);
  logger.info("User details added to the database. Registration successful!");
  return res.send("User details added to the registry");

});


async function redisGet(key) {
  let tokenValue = await rediscl.get(key, (err, res) => {
    if (err) throw err;
  });
  tokenValue = JSON.parse(tokenValue);
  return tokenValue;
};


async function redisSet(key, key, skey){
  await rediscl.set(
    key,
    JSON.stringify({
      refresh_token: key,
      expires: skey
    })
  );
}

router.post('/login', async (req, res) => {
  logger.debug("This is login route");
  try {
    await login.validateLogin(req);

  } catch (error) {
    logger.error("This is Login error", error);
    return res.send(error.message);
  }
  logger.info("User details are correct and successfully logged in");

  let refresh_token = generate_refresh_token(64);
  let refresh_token_maxage = new Date() + jwt_refresh_expiration;

  let token = jwt.sign({id: refresh_token}, jwt_secret, {
    expiresIn: jwt_expiration
  });

  res.cookie("access_token", token, {
    httpOnly: true
  });
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true
  });



  try{
    await redisSet(refresh_token, refresh_token, refresh_token_maxage);
  } catch(error){
    return res.send("error");
  }

  return res.send(" You have successfully logged in");

});






async function validate_jwt(req, res) {
   
  let accesstoken = req.cookies.access_token || null;
  let refreshtoken = req.cookies.refresh_token || null;
  if (accesstoken && refreshtoken) {

    jwt.verify(accesstoken, jwt_secret, async function (err, decoded) {
      if (err) {
        logger.info("Entered into if err" + err);
        if (err.name === "TokenExpiredError") {
          let redis_token = await redisGet(refreshtoken);
          if (
            !redis_token ||
            redis_token.refresh_token !== refreshtoken
          ) {
            logger.info("Entered into hacker region # 1");
            throw new OAuthValidationError("Nice try ;-)");
          } 
          else {
            logger.info("Entered into else of hacker # 1");
            if (redis_token.expires > new Date()) {
              logger.info("Entered into Expiration if loop");

              let refresh_token = generate_refresh_token(64);

              res.cookie("__refresh_token", refresh_token, {
                httpOnly: true
              });

              let refresh_token_maxage = new Date() + jwt_refresh_expiration;

              await redisSet(refresh_token, refresh_token, refresh_token_maxage);

              let token = jwt.sign({id: refresh_token}, jwt_secret, {
                expiresIn: jwt_expiration
              });
              
              res.cookie("__access_token", token, {
                httpOnly: true
              });
              res.cookie("session_id", refresh_token, {
                httponly: true
              })
            }
            logger.info("Authorization succesfull! Changed the expiration date");

          }
        } 
        else {
          logger.info("Entered into else of other errors" + err);
          throw new OAuthValidationError("Error in JWT Verification : " + err);
        }
      } 
      else {
        logger.info("Entered into else of no error");

        let redis_token = await redisGet(refreshtoken);
        if (
          !redis_token
        ) {
          logger.info("Cookie Modified at refresh token");
          throw new OAuthValidationError("Cookie Modified!");
        }
        logger.info("Entered into final Authorization succesful");
      }
    });
  } 
  else {
    logger.info("Token missing man");
    throw new OAuthValidationError("Token missing!!");
  };

}


function generate_refresh_token(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz012345";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}


router.post("/profile", async (req, res, next) => {
  async function authorizationjwt(){
    try{
        
      await validate_jwt(req, res);
      
    }
    catch(error){
      logger.error("This is Authoriz error" + error);
      res.send(error.message);
    };
  }
  authorizationjwt().catch(err => {
    throw new OAuthValidationError(err);
  });
  console.log("You have successfully logged in with Authentication and Authorization. <3");
  return res.send("You have successfully logged in with Authentication and Authorization");
  
});










module.exports = router;
