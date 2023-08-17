module.exports = Object.freeze({
    MAX_USERNAME_LEN: 20,
    MIN_USERNAME_LEN: 6,
    USERNAME_REGEX: /^[a-z][a-z0-9]{7,19}$/,
    MIN_MOBILE_LEN: 10,
    MAX_MOBILE_LEN: 10,
    MOBILE_REGEX: /[0-9]{10}/,
    MAX_PASSWORD_LEN: 31,
    MIN_PASSWORD_LEN: 8,
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*_])[A-Za-z\d!@#$%&*_]{8,31}$/,
    MIN_NAME_LEN: 3,
    MAX_NAME_LEN: 40,
    INTERNAL_TOKEN_EXPIRY_BUFFER: 100,
    STATUS : {
        SUCCESS : {CODE: "0", MSG: "success"},
        TOKEN_VALIDATION_FAILURE: {CODE: "3", MSG: "token verification failed"}
    },
    STATUS_CODE: "statusCode",
    STATUS_MESSAGE: "statusMessage",
    SERVER_TIME: "serverTime",

    jwt_expiration: 60 * 10,
    jwt_refresh_expiration: 60 * 60 * 24 * 30,


});