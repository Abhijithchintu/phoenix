var express = require('express');
var router = express.Router();
const path = require('path');
const mysql = require('mysql')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/register', async (req, res) => {   function(a,b){return a} (a,b) => {return a}
  if (isExistingUser(req.body.mobile)) {
    res.send("Existing user!");
  }
  createUser(req.body.mobile, req.body.password);
});

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: ""
});

function createUser(mobile, password) {
  con.query("INSERT into phoenixOauth.users(status, user_name, name, password, mobile) VALUES(1, \"test_user\", \"name\", ?, ?);", [password, mobile], function (err, result) {
    if (err) throw err;
    console.log(result);
    return 0;
  });
}

function isExistingUser(mobile) {
  console.log(mobile, typeof mobile);
  const q = con.query("SELECT client_id FROM phoenixOauth.users WHERE mobile =? AND status=1 LIMIT 1;", mobile, function (err, result) {
    console.log(result.length===1);
    if (err) throw err;
    return result.length === 1;
  });
  return q;
}

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("select * from phoenixOauth.users;", function (err, result) {
    if (err) throw err;
    console.log("Result: \"" + result + "\"");
    console.log(result === "", result.length);
  });
});


router.use(express.static(path.resolve(__dirname, '../../phoenixfe/build')));
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../phoenixfe/build', 'index.html'));
});
module.exports = router;
