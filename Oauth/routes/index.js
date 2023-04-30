const path = require('path');
const mysql = require('mysql');

const constants = require('../config/constants');
var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config.js')[env];
var login = require('../api/login')

const PORT = process.env.PORT || "3000";
var validation = require("../api/validation");
const logger = require("../logger");

const OAuthValidationError = require("../error/OAuthValidationError");
var validate_internal_client = require("../middleware/internal").validate_internal_client;

const register = require("../api/register")

const redis = require("redis");
const jwt = require("jsonwebtoken");

var rediscl = redis.createClient();
const jwt_refresh_expiration = 60 * 60 * 24 * 30;
const jwt_secret = "jwtfanhere";
const jwt_expiration = 60 * 10;

router.use(express.urlencoded({ extended: true })); //bodyparser
router.use(express.json());

router.use(express.static(path.resolve(__dirname, '../../phoenixfe/build')));
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../phoenixfe/build', 'index.html'));
});

router.get('/test', (req, res, next) => {
  res.send('Hello World!');
  next();
})

router.get('/health-check', async (req, res) => {
  const message = {
    "message": "health is ok",
    "uptime": process.uptime(),
    "timestamp": Date(Date.now())
  }
  try{
    res.send(message)
  }
  catch(e){
    healthcheck.message = e;
		res.status(503).send();
  }
})


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

router.post('/login', async (req, res) => {
  logger.debug("This is login route");
  try {
    user_id_obj = await login.validateLogin(req);
    console.log('baby here it is')
    console.log(user_id_obj)
    user_id = user_id_obj[0].client_id
  } catch (error) {
    logger.error("This is Login error", error);
    return res.send(error.message);
  }
  //here should we check if userid is null 
  logger.info("User details are correct and successfully logged in");

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


  console.log("here is the user_id", user_id);
  let uid = JSON.stringify(user_id);
  console.log("here is the string for redis", JSON.stringify({
    refresh_token: refresh_token,
    expires: refresh_token_maxage
  }));
  rediscl.set(uid, JSON.stringify({
    refresh_token: refresh_token,
    expires: refresh_token_maxage
  }), function (err, result) {
    if (err) throw (err);
    console.log(result);
  }
  );


  var siftvalue = await rediscl.get(uid);
  console.log(siftvalue, " here it is");
  return res.send(" You have successfully logged in");

});

router.post("/profile", (req, res, next) => {

  login.validate_jwt(req, res).then(result => {

    console.log("You have successfully logged in with Authentication and Authorization. <3");
    res.send("you are in profile page")
  })
    .catch(error => {
      throw error;
    });
});



rediscl.connect().then(async () => {
  rediscl.on('error', err => {
    console.log('Error ' + err);
    logger.info("Error is her");
  });
});


router.post("/healthcheck/internal", validate_internal_client, async (req, res) => {
  if ("internal_client_id" in req)
    res.send(
      {
        STATUS_CODE: STATUS.SUCCESS.CODE,
        STATUS_MESSAGE: STATUS.SUCCESS.MSG,
        [constants.SERVER_TIME]: Date.now()
      }
    );
  else
    res.send(
      {
        STATUS_CODE: STATUS.TOKEN_VALIDATION_FAILURE.CODE,
        STATUS_MESSAGE: STATUS.TOKEN_VALIDATION_FAILURE.MSG,
        [constants.SERVER_TIME]: Date.now()
      }
    );
});






module.exports = router;
