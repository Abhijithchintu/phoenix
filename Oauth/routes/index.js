const path = require('path');
const mysql = require('mysql');

const constants = require('../config/constants');
var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config.js')[env];

const PORT = process.env.PORT || "3000";
var validation = require("../validation");
const logger = require("../logger");

const OAuthValidationError = require("../error/OAuthValidationError");


router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.get('/test', (req, res, next) => {
  res.send('Hello World!');
  next();
})







router.post('/register', async (req, res) => {

  logger.debug("This is Registration route");

  try {
    validation.validateUserRegisterRequest(req);
  } catch (error) {
    logger.error("This is Registration error", error);
    return res.send(error.message);
  }

  if (await isExistingUserMobile(req.body.mobile)) {
    logger.error("Mobile number already registered");
    return res.send("Mobile number is already registered!");
  }
  if (await isExistingUserUserName(req.body.userName)) {
    logger.error("User Name already exists");
    return res.send("User name already exists!");
  }
  createUser(req.body.userName, req.body.name, req.body.mobile, req.body.password);
  logger.info("User details added to the database. Registration successful!");
  return res.send("User details added to the registry");


});

var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password
});




function createUser(userName, name, mobile, password) {
  logger.debug(" Creating User");
  con.query("INSERT into phoenixOauth.users(status, user_name, name, password, mobile) VALUES(1, ?, ?, ?, ?);", [userName.toLowerCase(), name, password, mobile], function (err, result) {
    if (err) throw err;
    return 0;
  });
}

async function isExistingUserMobile(mobile) {

  logger.debug("Checking the Registering mobile number in the database");

  return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=?) AND status=1 LIMIT 1;", [mobile], function (err, result) {
    if (err) throw err;
    resolve(result.length === 1);
  }));

}

async function isExistingUserUserName(userName) {

  logger.debug("Checking the Registering user name in the database");

  return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (user_name=?) AND status=1 LIMIT 1;", [userName.toLowerCase()], function (err, result) {
    
    if (err) throw err;
    resolve(result.length === 1);
  }));

}

con.connect(function (err) {
  if (err) throw err;
  con.query("select * from phoenixOauth.users;", function (err, result) {
    if (err) throw err;
  });
});


router.use(express.static(path.resolve(__dirname, '../../phoenixfe/build')));
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../phoenixfe/build', 'index.html'));
});




async function validateLogin(req) {
  let clientid;
  logger.debug("Validating user login details");
  var validateUseridPromise = new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=? or user_name=?) AND status=1 LIMIT 1;", [req.body.userid, req.body.userid], function (err, result) {
    if (err) throw err;
    console.log(result.length + " :result length");
    if (result.length === 0) {
      logger.error(req.body.userid + " :userid not found in the registry");
    }
    return resolve(result.length === 1);
  }));

  if (await validateUseridPromise) {
    var validatePasswordPromise = new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE ((mobile=? or user_name=?) and password=?) AND status=1 LIMIT 1;", [req.body.userid, req.body.userid, req.body.password], function (err, result) {
      if (err) throw err;
      console.log(result.length + " :result length");
      if (!result.length) {
        logger.error(req.body.password + " :password is incorrect" + " or " + req.body.userid + ":userid is incorrect!");
      }
      else {
        result = JSON.parse(JSON.stringify(result));
        console.log(">>> result", result);
        clientid = result[0].client_id;
      }
      return resolve(result);
    }));
  }
  else {
    throw new OAuthValidationError("userid is wrong, try again");
  }
  if (!(await validatePasswordPromise)) {
    throw new OAuthValidationError("Password is incorrect, try again");
  }
  else {
    return clientid;
  }

}


const redis = require("redis");
const jwt = require("jsonwebtoken");

var rediscl = redis.createClient();

rediscl.connect().then(async () => {
  rediscl.on('error', err => {
    console.log('Error ' + err);
    logger.info("Error is here");
  });
});



const jwt_secret = "jwtfanhere";
const jwt_expiration = 1000*60 ;
const jwt_refresh_expiration = 1000*60 * 5;

async function redisGet(redisKey){
  let tokenValue = await rediscl.get(redisKey, function (err, val) {
    if (err) throw err;
  });
  logger.info("You have succesfullly got redis values" + tokenValue);
  let tokenValues = JSON.parse(tokenValue);
  return tokenValues;
}

async function redisSet(redisKey, redisValue1, redisValue2){
  rediscl.set(
    redisKey,
    JSON.stringify({
      refresh_token: redisValue1,
      expires: redisValue2
    }), function (err, result) {
      if (err) throw (err);
      console.log(result);
    }
  );
}




router.post('/login', async (req, res) => {
  logger.debug("This is login route");
  try {
    user_id = await validateLogin(req);
    console.log(user_id) + "Here is it!!!";

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


  let uid = JSON.stringify(user_id);

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

  try{
      
    await validate_jwt(req, res);
    
  }
  catch(error){
    logger.error("This is Authoriz error" + error);
    res.send(error.message);
  };

  console.log("You have successfully logged in with Authentication and Authorization. <3");
  return res.send("You have successfully logged in with Authentication and Authorization");
  
});










module.exports = router;
