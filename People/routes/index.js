const express = require('express');
const router = express.Router();

const Relation = require("../api/relation");

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

const auth_interceptor = require("../middleware/internal").auth_interceptor;
router.get('/getRelationBetween', auth_interceptor,
    async (req, res) => {
      // res.send(Relation.get_relation_between(req));
        console.log(req.internal_client_id);
      res.send({"status": "success!"});
    })

router.get('/getAllRelations', async (req, res) => {
  // we will be having 2 dbs, frnz and blocked. we should have data synced between 2 dbs
  let user_id = req.query.user_id
  let relations = {}
  relations.friends = dao.get_all_friends(user_id)
  relations.blocked = dao.get_all_blocked(user_id)
  res.send(relations)
})
module.exports = router;
