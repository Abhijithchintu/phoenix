const path = require('path');

const constants = require('../config/constants');

var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config.js')[env];
var url = require("url");

const PORT = process.env.PORT || "3000";
var validation = require("../api/validation");
const logger = require("../logger");

const OAuthValidationError = require("../error/OAuthValidationError");

<<<<<<< HEAD
const STATUS = constants.STATUS;
const STATUS_CODE = constants.STATUS_CODE;
const STATUS_MESSAGE = constants.STATUS_MESSAGE;
=======
const register = require("../api/register")
>>>>>>> origin/main

const redis = require("redis");
const jwt = require("jsonwebtoken");

var rediscl = redis.createClient();

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

router.post("/profile", (req, res, next) => {

  validate_jwt(req, res).then(result => {

    console.log("You have successfully logged in with Authentication and Authorization. <3");
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

const jwt_secret = "jwtfanhere";
const jwt_expiration = 60 * 10;
const jwt_refresh_expiration = 60 * 60 * 24 * 30;


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

<<<<<<< HEAD

router.post("/profile", (req, res, next) => {

  validate_jwt(req, res).then(result => {

    console.log("You have successfully logged in with Authentication and Authorization. <3");
  })
    .catch(error => {
      throw error;
    });
});


function generate_internal_client_token() {
  const secret = 'abc'; // move secret, client_id to vault
  var token = jwt.sign({
        client_id: 12,
        iat: Math.floor(Date.now())
    },
    secret);
    return token;

}


function parseJwt (token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}


function get_api(req) {
  var path = url.parse(req.url).pathname;
  if (!path.length < 1 && path[path.length - 1] == '/')
    path = path.substring(0, path.length - 1);
  return path;
}


function get_client_key(body, path) {
  return new Promise((resolve, reject) => con.query(
    "SELECT c.key FROM phoenixOauth.client_permissions cp, phoenixOauth.clients c " +
    "WHERE c.client_id=? and c.status=1 and " +
    "cp.client_id=c.client_id and cp.status=1 and cp.api=? LIMIT 1;",
    [body.client_id, path],
    function (err, result) {
      if (err)
        throw err;
      if (result.length < 1 || !"key" in result[0])
        return resolve(null);
      return resolve(result[0].key);
    }));
}


async function validate_internal_client(req, res, next) {
  try {
    token = req.headers["jwt-token"] || req.headers["x-access-token"] || req.body.token;
    if (!token)
      return next();

    var path = get_api(req);
    var body = parseJwt(token);
    var client_key = get_client_key(body, path);
    if (!await client_key)
      return next();
    
    jwt.verify(token, await client_key);
    if (!body.client_id || !body.iat)
      return next();

    if (parseInt(body.iat) + constants.INTERNAL_TOKEN_EXPIRY_BUFFER < Date.now())
      return next();
  } catch (err) {
    return next();
  }
  req.internal_client_id = body.client_id;
  next();
}


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


=======
>>>>>>> origin/main
module.exports = router;
