class OAuthValidationError extends Error {
    constructor(message, error_code) {
        super(message);
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