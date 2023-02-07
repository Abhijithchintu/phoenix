const path = require('path');
const mysql = require('mysql');

const constants = require('../config/constants');
var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config.js')[env];

const OAuthValidationError = require("../error/OAuthValidationError");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

function validateUserRegisterRequest(req){
  validationUserName(req.body.userName);
  validationMobileNumber(req.body.mobile);
  validationPassword(req.body.password);
  validationName(req.body.name);
}

router.post('/register', async (req, res) => {

  try {
    validateUserRegisterRequest(req);
  } catch (error) {
    return res.send(error.message);
  }
  
  if (await isExistingUser(req.body.mobile, req.body.userName)) {
    return res.send("Existing user!");
  }
  createUser(req.body.userName, req.body.name, req.body.mobile, req.body.password);
  res.send("upto the amark");
});

var con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password
});


//validation for username
function validationName(name){
  if(name === undefined){
    throw new OAuthValidationError("Name is not defined");
  }
  if(name.length < constants.MIN_NAME_LEN ){
    throw new OAuthValidationError("Name is too short, it should contain atleat 3 characters");
  }
  if(name.length > constants.MAX_NAME_LEN){
    throw new OAuthValidationError("Name is too long, it should contain only 40 characters");
  }
}


function validationPassword(password){
  if(password === undefined){
    throw new OAuthValidationError("Password is undefined");
  }
  if(password.length > constants.MAX_PASSWORD_LEN){
    throw new OAuthValidationError("Password is too long, it should be in the range of (8-31)");
  }
  if(password.length < constants.MIN_PASSWORD_LEN){
    throw new OAuthValidationError("Password is too short, it should be in the range of (8-31)");
  }
  if(!password.match(constants.PASSWORD_REGEX)){
    throw new OAuthValidationError("Password must contain atleast 1 Capital letter, 1 small letter and 1 special character");
  }
}

function  validationMobileNumber(mobile){
  if(mobile === undefined){
    throw new OAuthValidationError("Mobile Number is undefined");
  }
  if(mobile === null){
    throw new OAuthValidationError("Mobile number is empty");
  }
  if(mobile.length > constants.MAX_MOBILE_LEN){
    throw new OAuthValidationError("Mobile number is too long, it should contain 10 digits");
  }
  if(mobile.length < constants.MIN_MOBILE_LEN){
    throw new OAuthValidationError("Mobile number is too short, it should contain 10 digits");
  }
  if(!mobile.match(constants.MOBILE_REGEX)){
    throw new OAuthValidationError("Mobile Number should only contain 10 digts");
  }
}

function validationUserName(userName){
  if(userName === undefined){
    throw new OAuthValidationError("User Name is undefined");
  }
  if(userName === null){
    throw new OAuthValidationError("User Name is Empty");
  }
  userName = userName.toLowerCase();
  if(userName.length > constants.MAX_USERNAME_LEN){
    throw new OAuthValidationError("User Name is too long, it should be in the range of (8-20)");
  }
  if(userName.length < constants.MIN_USERNAME_LEN){
    throw new OAuthValidationError("User Name is too short, it should be in the range of (8-20)");
  }

  
  if(!userName.match(constants.USERNAME_REGEX)){
    throw new OAuthValidationError("User Name should start with an alphabet, it should contain only alphabets and numbers");
  }
}


function createUser(userName, name, mobile, password) {
  con.query("INSERT into phoenixOauth.users(status, user_name, name, password, mobile) VALUES(1, ?, ?, ?, ?);", [userName.toLowerCase(), name, password, mobile], function (err, result) {
    if (err) throw err;
    //console.log(result);
    return 0;
  });
}

async function isExistingUser(mobile, userName) {

  // console.log(mobile, typeof mobile);
  return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=? OR user_name=?) AND status=1 LIMIT 1;", [mobile, userName.toLowerCase()], function (err, result) {
    // console.log(result.length===1);
    if (err) throw err;
    console.log(" check th type of result: ", typeof result);
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
