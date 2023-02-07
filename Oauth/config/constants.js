module.exports = Object.freeze({
    MAX_USERNAME_LEN: 20,
    MIN_USERNAME_LEN: 8,
    USERNAME_REGEX: /^[a-z][a-z0-9]{7,19}$/,
    MIN_MOBILE_LEN: 10,
    MAX_MOBILE_LEN: 10,
    MOBILE_REGEX: /[0-9]{10}/,
    MAX_PASSWORD_LEN: 31,
    MIN_PASSWORD_LEN: 8,
    PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*_])[A-Za-z\d!@#$%&*_]{8,31}$/,
    MIN_NAME_LEN: 3,
    MAX_NAME_LEN: 40
});