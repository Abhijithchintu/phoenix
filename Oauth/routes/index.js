const express = require('express');
const redis = require('redis');
const cors = require('cors');
const login = require('../api/login');
const logger = require('../logger');
const { validate_internal_client } = require('../middleware/internal');
const register = require('../api/register');
const api_wrapper = require('../middleware/apiWrapper');
const stats = require('../api/stats');

const router = express.Router();
const redis_client = redis.createClient();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(cors());

redis_client.connect().then(async () => {
	redis_client.on('error', (err) => {
		console.log(`Error ${err}`);
		logger.info('Error is her');
	});
});

router.get('/health-check', async (req, res) => {
	try {
		res.send(stats.health_check());
	} catch (e) {
		res.status(503).send();
	}
});

router.post(
	'/register',
	api_wrapper(async (req, res) => {
		return register.register(req, res);
	}),
);

router.post(
	'/login',
	api_wrapper(async (req, res) => {
		return login.login(req, res);
	}),
);

router.post(
	'/token/verify',
	api_wrapper(async (req, res) => {
		return login.verify_token(req, res);
	}),
);

router.post(
	'/profile',
	api_wrapper(async (req, res) => {
		return res.send(await login.profile(req, res));
	}),
);

router.post(
	'/healthcheck/internal',
	validate_internal_client,
	async (req, res) => {
		return res.send(stats.internal_healthcheck(req, res));
	},
);

module.exports = router;
