const path = require('path');
const mysql = require('mysql');

var express = require('express');
var router = express.Router();
var env = process.env.NODE_ENV || 'local';
var config = require('../config/config.js')[env];

require("../error/OAuthValidationError");

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/register', async (req, res) => {
  let userName = req.body.userName;
  userName = userName.toLowerCase();
  var v;
  try {
    v = validationUserName(req.body.userName);
  } catch (error) {
    return res.send(error)
  }
  
  console.log(v);
  if ("1" !== v)
    {return res.send(v);}
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

function validationUserName(userName){
  console.log(userName);
  if(userName === null){
    throw new OAuthValidationError("User Name is Empty");
  }
  if(userName.length > 20){
    throw new OAuthValidationError("User Name is too long, it should be in the range of (8-20)");
  }
  if(userName.length < 8){
    return "User Name is too short, it should be in the range of (8-20)";
  }

  var validID = /^[a-z][a-z0-9]{7,19}$/;
  if(!userName.match(validID)){
    return "User Name should start with an alphabet, it should contain only alphabets and numbers";
  }
}



function createUser(userName, name, mobile, password) {
  con.query("INSERT into phoenixOauth.users(status, user_name, name, password, mobile) VALUES(1, ?, ?, ?, ?);", [userName, name, password, mobile], function (err, result) {
    if (err) throw err;
    //console.log(result);
    return 0;
  });
}

async function isExistingUser(mobile, userName) {

  // console.log(mobile, typeof mobile);
  return new Promise((resolve, reject) => con.query("SELECT client_id FROM phoenixOauth.users WHERE (mobile=? OR user_name=?) AND status=1 LIMIT 1;", [mobile, userName], function (err, result) {
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
