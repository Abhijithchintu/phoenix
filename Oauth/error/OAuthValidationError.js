class OAuthValidationError extends Error {
    constructor(message, error_code) {
        super(message);
        this.error_code = error_code;
    }
    get message() {
        return this.message;
    }
}

module.exports = OAuthValidationError;