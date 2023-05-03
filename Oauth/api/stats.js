const constants = require("../constant/constants");

class stats {
    static async internal_healthcheck(req, res) {
        if ("internal_client_id" in req)
            return {
                    STATUS_CODE: STATUS.SUCCESS.CODE,
                    STATUS_MESSAGE: STATUS.SUCCESS.MSG,
                    [constants.SERVER_TIME]: Date.now()
                };
        else
            return {
                STATUS_CODE: STATUS.TOKEN_VALIDATION_FAILURE.CODE,
                STATUS_MESSAGE: STATUS.TOKEN_VALIDATION_FAILURE.MSG,
                [constants.SERVER_TIME]: Date.now()
            };
    }

    static health_check() {
        return {
            "message": "health is ok",
            "uptime": process.uptime(),
            "timestamp": Date(Date.now())
        };
    }
}

module.exports = stats