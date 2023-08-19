const OAuthValidationError = require("../error/OAuthValidationError");


module.exports = function api_wrapper(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error instanceof OAuthValidationError) {
                res.setHeader('content-type', 'text/json');
                res.status(400);
                return res.send(error.to_json());
            } else {
                res.setHeader('content-type', 'text/json');
                res.status(500);
                return res.send({
                    "error_code": "500",
                    "error_message": "Internal Server Error!"
                });
            }
        }
    }
}