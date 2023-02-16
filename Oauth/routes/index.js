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

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

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
    logger.error("This is Registration error");
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
  res.send("User details added to the registry");


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
    //console.log(result);
    return 0;
  });
}

async function isExistingUserMobile(mobile) {

  logger.debug("Checking the Registering mobile number in the database");

  // console.log(mobile, typeof mobile);
  return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=?) AND status=1 LIMIT 1;", [mobile], function (err, result) {
    // console.log(result.length===1);
    if (err) throw err;
    resolve(result.length === 1);
  }));
  
}

async function isExistingUserUserName(userName) {

  logger.debug("Checking the Registering user name in the database");

  // console.log(mobile, typeof mobile);
  return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (user_name=?) AND status=1 LIMIT 1;", [userName.toLowerCase()], function (err, result) {
    // console.log(result.length===1);
    if (err) throw err;
    resolve(result.length === 1);
  }));
  
}

con.connect(function(err) {
  if (err) throw err;
  // console.log("Connected!");
  con.query("select * from phoenixOauth.users;", function (err, result) {
    if (err) throw err;
    // console.log("Result: \"" + result + "\"");
    // console.log(result === "", result.length);
  });
});


router.use(express.static(path.resolve(__dirname, '../../phoenixfe/build')));
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../phoenixfe/build', 'index.html'));
});
module.exports = router;
