class OAuthValidationError extends Error{
    constructor(message) {
        super(message);
    }
    get message(){
        return this.message;
    }
}

module.exports = OAuthValidationError;