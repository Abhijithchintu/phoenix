const status_code = require("../constant/statusCode");

class OAuthValidationError extends Error {
    constructor(error_code) {
        super(status_code[error_code]);
        this.error_code = error_code;
    }

    to_json() {
        return {
            "error_code": this.error_code,
            "error_message": this.message
        };
    }
}

module.exports = OAuthValidationError;