const jwt = require("jsonwebtoken");
const url = require("url");


const con = require("../external/condb")();
const constants = require("../constant/constants");

class internal {
    static generate_internal_client_token() {
        const secret = 'abc'; // move secret, client_id to vault
        return jwt.sign({
                client_id: 12,
                iat: Math.floor(Date.now())
            },
            secret);

    }


    static parseJwt(token) {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }


    static get_api(req) {
        let path = url.parse(req.url).pathname;
        if (!path.length < 1 && path[path.length - 1] === '/')
            path = path.substring(0, path.length - 1);
        return path;
    }


    static get_client_key(body, path) {
        return new Promise((resolve, reject) => con.query(
            "SELECT c.key FROM phoenixPeople.client_permissions cp, phoenixPeople.clients c " +
            "WHERE c.client_id=? and c.status=1 and " +
            "cp.client_id=c.client_id and cp.status=1 and cp.api=? LIMIT 1;",
            [body.client_id, path],
            function (err, result) {
                if (err)
                    throw err;
                console.log(result);
                if (result.length < 1 || !"key" in result[0]) {
                    return resolve(null);
                }
                console.log(result[0])
                console.log(result[0].key)
                return resolve(result[0].key);
            }));
    }

    static async user_session_interceptor(req) {

    }

    static async auth_interceptor(req, res, next) {
        await Promise.all([
            internal.validate_internal_client(req),
            internal.user_session_interceptor(req)
        ]);
        return next();
    }


    static async validate_internal_client(req) {
        try {
            const token = req.headers["jwt-token"] || req.headers["x-access-token"] || req.body.token;
            if (!token)
                return;
            console.log(token);
            const path = internal.get_api(req);

            const body = internal.parseJwt(token);
            const client_key = internal.get_client_key(body, path);
            if (!await client_key) {
                return;
            }
            await jwt.verify(token, await client_key);
            if (!body.client_id || !body.iat)
                return;
            console.log(body)
            if (parseInt(body.iat) + constants.INTERNAL_TOKEN_EXPIRY_BUFFER < Date.now()) {
                return;
            }
            req.internal_client_id = body.client_id;
            return;
        } catch (err) {
            return;
        }
    }
}

module.exports = internal;