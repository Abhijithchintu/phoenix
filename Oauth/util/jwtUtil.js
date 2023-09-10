const config = require('config');
const jwt = require("jsonwebtoken");

const OAuthValidationError = require("../error/OAuthValidationError");
const OAuthTokenError = require("../error/OAuthTokenError");

const jwt_secret = config.get("jwt_secret");


class jwtUtil {
    static parseJwt(token) {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }

    static async validate_and_get_body(req) {
        const token = req.headers["jwt-token"] || req.headers["x-access-token"] || req.body.token;
        if (!token || !token.includes("."))
            throw new OAuthTokenError("OA_1022");

        const body = jwtUtil.parseJwt(token);
        const { uid, iat, exp } = body;

        if (!uid || !iat || !exp)
            throw new OAuthTokenError("OA_1022");

        if (exp * 1000 < new Date().getTime() || exp < iat)
            throw new OAuthTokenError("OA_1022");

        try {
            jwt.verify(token, await jwt_secret);
        } catch (err) {
            throw new OAuthTokenError("OA_1022");
        }
        return uid;
    }
}

module.exports = jwtUtil;