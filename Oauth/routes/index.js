const path = require('path');

const constants = require('../config/constants');
const express = require('express');
const router = express.Router();
const env = process.env.NODE_ENV || 'local';
const config = require('../config/config.js')[env];

const PORT = process.env.PORT || "3000";
const validation = require("../api/validation");
const logger = require("../logger");

const OAuthValidationError = require("../error/OAuthValidationError");

const register = require("../api/register")
const login = require("../api/login");

const jwt_secret = "jwtfanhere";
const jwt_expiration = 60 * 10;
const jwt_refresh_expiration = 60 * 60 * 24 * 30;

const redis = require("redis");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

const rediscl = redis.createClient();

rediscl.connect() .then(async () => {
  rediscl.on('error', err => { 
    logger.error("Redis Error: " + err) ;
    throw err ;
  });
  rediscl.on('ready', async () => {
    logger.info("Connected to redis");
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


async function redisGet(key){
  const redisValue = await rediscl.get(key , (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  })
  return redisValue;
}


const jwtSecret = "Veediveedigummadipandu";

router.post('/login', async (req, res) => {
  logger.debug("This is login route");
  var uniqueid;
  try {
    uniqueid = await login.validateLogin(req);
  } catch (error) {
    logger.error("This is Login error", error);
    return res.send(error.message);
  }
  logger.info("User details are correct and successfully logged in");

  const token = jwt.sign({id: uniqueid}, jwtSecret, {
    expiresIn: jwt_expiration
  });
  const refresh_token = jwt.sign({id: uniqueid}, jwtSecret, {
    expiresIn: jwt_expiration
  });

  res.cookie("access_token", token, {
    httpOnly: true
  });
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true
  });

  logger.info("Uniqueid: " + uniqueid);



  rediscl.set(
    JSON.stringify(uniqueid),
    JSON.stringify({
      refresh_token: refresh_token,
      token: token
    })
  );
  const testerSet = await redisGet(JSON.stringify(uniqueid));
  console.log("<<<<<>>>>>>>" + testerSet);

  return res.send(" You have successfully logged in");

});







const verifyToken = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
};


const TOKEN_EXPIRED_ERROR = "TokenExpiredError";
const INVALID_TOKEN_ERROR = "JsonWebTokenError";


async function authorizeToken(req, res, next, tokenType) {
  try {
    console.log('cookies')
    console.log(req.cookies)
    const { access_token, refresh_token } = req.cookies;
    const token = tokenType === "access" ? access_token : refresh_token;
    const decodedToken = await verifyToken(token, jwtSecret);
    console.log('1')
    console.log(decodedToken)
    

    const redisData = await redisGet(JSON.stringify(decodedToken.id));
    console.log('2')
    console.log(redisData)
    
    if (!redisData) {
      throw new OAuthValidationError(`Invalid ${tokenType} token specified`);
    }

    const { refresh_token: rt, token: at } = JSON.parse(redisData);

    if (token !== (tokenType === "access" ? at : rt)) {
      throw new OAuthValidationError(`Mismatch of the ${tokenType} token`);
    }

    req.user = decodedToken;
    console.log('3')
    console.log(req.user)
    next();
  } catch (err) {
    console.error(err);

    if (err.name === TOKEN_EXPIRED_ERROR && tokenType === "refresh") {
      // refresh token expired. Ask user to login
     //res.status(401).send({ error: "Please login again" });
    } else if (
      err.name === INVALID_TOKEN_ERROR ||
      err.message.includes("Invalid access token specified")
    ) {
      // res.status(401).send({ error: "Invalid access token specified" });
      //res.status(401).send({ error: "Invalid access token specified" });
      throw new Error("Invalid access token specified")
    } else {
      // res
      //   .status(401)
      //   .send({ error: `Not authorized to access this ${tokenType} resource` });
      throw new Error("Invalid access token specified    hhhhhhh")
    }
  }
}

router.post('/profile',async (req, res, next) => {
  await authorizeToken(req, res, next);
  console.log('You have successfully logged in with Authentication and Authorization. <3');
  res.send('You have successfully logged in with Authentication and Authorization');
});






module.exports = router;




