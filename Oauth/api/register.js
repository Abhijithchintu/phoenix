const validation = require('./validation');
const Users = require('../dao/users');

const login = require('./login');

class register {
	static async register(req, res) {
		validation.validate_user_register_request(req);
		await validation.validate_if_user_exists(req);
		await Users.create_new_user(
			req.body.user_name,
			req.body.gender,
			req.body.name,
			req.body.password,
			req.body.mobile,
			req.body.dob,
		);

		return login.login(req, res);
	}
}

module.exports = register;
