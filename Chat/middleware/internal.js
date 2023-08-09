const jwt = require("jsonwebtoken");

const con = require("../external/condb")();

class internal {
    static generate_internal_client_token() {
        const secret = 'chat-key'; // move secret, client_id to vault
        return jwt.sign({
                client_id: 2,
                iat: Math.floor(Date.now())
            },
            secret);

    }


    static parseJwt(token) {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    }


    static get_api(req) {
        let path = url.parse(req.url).pathname;
        if (!path.length < 1 && path[path.length - 1] == '/')
            path = path.substring(0, path.length - 1);
        return path;
    }


    static get_client_key(body, path) {
        return new Promise((resolve, reject) => con.query(
            "SELECT c.key FROM phoenixChat.client_permissions cp, phoenixChat.clients c " +
            "WHERE c.client_id=? and c.status=1 and " +
            "cp.client_id=c.client_id and cp.status=1 and cp.api=? LIMIT 1;",
            [body.client_id, path],
            function (err, result) {
                if (err)
                    throw err;
                if (result.length < 1 || !"key" in result[0])
                    return resolve(null);
                return resolve(result[0].key);
            }));
    }


    static async validate_internal_client(req, res, next) {
        try {
            const token = req.headers["jwt-token"] || req.headers["x-access-token"] || req.body.token;
            if (!token)
                return next();

            const path = get_api(req);
            const body = parseJwt(token);
            const client_key = get_client_key(body, path);
            if (!await client_key)
                return next();

            jwt.verify(token, await client_key);
            if (!body.client_id || !body.iat)
                return next();

            if (parseInt(body.iat) + constants.INTERNAL_TOKEN_EXPIRY_BUFFER < Date.now())
                return next();
        } catch (err) {
            return next();
        }
        req.internal_client_id = body.client_id;
        next();
    }
}

module.exports = internal;