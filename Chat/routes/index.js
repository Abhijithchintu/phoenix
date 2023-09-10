var express = require('express');
const fetch = require("node-fetch");
const lastChatsquery = require('../api/lastChats');
const lastMessage = require('../api/lastMessages')
const api_wrapper = require('../middleware/apiWrapper')
var router = express.Router();
const {messages, rooms} = require('./../db/mongodb/schema')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

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

router.get('/dbcheck', async (req, res) => {
  //const task = await messages.create({'id': 1234,'sender_id': 123, 'message': 'heyy'})
  //const ll = await messages.insertMany({'id': 1234,'sender_id': 123, 'message': 'heyy'})
  const task = await messages.findOne({'id': 1234})
  res.send({task})
})

router.get('/getLastChats', api_wrapper(lastChatsquery.chatquery)) //some authorize functions should be there

router.get('/getChat', api_wrapper(lastMessage.getMessages))

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
