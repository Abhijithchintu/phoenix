const pool = require("../external/condb");
const db_connection = require("../external/condb");
const logger = require("../logger");
const con = db_connection();

class Users {
    constructor(client_id, status, user_name, name, gender, dob, photo_id, password, mobile, created_at, updated_at) {
        this.client_id = client_id;
        this.status = status;
        this.user_name = user_name;
        this.gender = gender;
        this.dob = dob;
        this.photo_id = photo_id;
        this.password = password;
        this.mobile = mobile;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    async insert() {
        return await con.query(
            "INSERT into phoenixOauth.users(status, user_name, name, password, mobile) " +
            "VALUES(1, ?, ?, ?, ?);",
            [this.status, this.user_name, this.user_name, this.password, this.mobile],
            function (err, result) {
                if (err) throw err;
                    return 0;//todo
            }
        );
    }

    static async get_by_mobile_or_user_name(mobile, user_name) {
        return new Promise((resolve) => {
            con.query(
                "SELECT * FROM phoenixOauth.users " +
                "WHERE (mobile=? or user_name=?) AND status=1 LIMIT 1;",
                [mobile, user_name],
                (error, result) => {
                    console.log(result);
                    if (!result.length)
                        resolve(null);
                    resolve(result[0]);
                }
            );
        });
    }

}

module.exports = Users;