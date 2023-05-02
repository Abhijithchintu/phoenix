const OAuthValidationError = require("../error/OAuthValidationError");


module.exports = function api_wrapper(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error instanceof OAuthValidationError) {
                res.setHeader('content-type', 'text/json');
                return res.send(error.to_json());
            } else {
                next(error);
            }
        }
    }
}