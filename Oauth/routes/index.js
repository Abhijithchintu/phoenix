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
var validate_internal_client = require("../middleware/internal").validate_internal_client;

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

function validate_jwt(req, res) {

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


function generate_refresh_token(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}


router.post("/profile", (req, res, next) => {

  validate_jwt(req, res).then(result => {

    console.log("You have successfully logged in with Authentication and Authorization. <3");
  })
    .catch(error => {
      throw error;
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
