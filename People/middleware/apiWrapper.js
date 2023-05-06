const PeopleValidationError = require("../error/PeopleValidationError");


module.exports = function api_wrapper(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error instanceof PeopleValidationError) {
                res.setHeader('content-type', 'text/json');
                res.status(400);
                return res.send(error.to_json());
            } else {
                next(error);
            }
        }
    }
}