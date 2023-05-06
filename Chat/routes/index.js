var express = require('express');
const fetch = require("node-fetch");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

router.get('/friends', async (req, res) => {
  const internal = require("../middleware/internal");
  const token = internal.generate_internal_client_token();
  const response = await fetch("http://localhost:3003/getRelationBetween", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      'jwt-token': token,
    }
  });
  const jsonData = await response.json();
  console.log(jsonData);
  res.send(jsonData);

})

module.exports = router;
