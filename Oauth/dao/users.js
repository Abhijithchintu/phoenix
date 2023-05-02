const pool = require("../external/condb");
const db_connection = require("../external/condb");
const logger = require("../logger");
const con = db_connection();

class Users {
    constructor(client_id, status, user_name, mobile, password, name, gender, dob, photo_id, created_at, updated_at) {
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

    static async create_new_user(user_name, gender, name, password, mobile, dob) {
        return await Users._insert(user_name, gender, name, password, mobile, dob);
    }

    static async _insert(user_name, gender, name, password, mobile, dob) {
        return new Promise((resolve) => {
            con.query(
                "INSERT into phoenixOauth.users(status, user_name, gender, name, password, mobile, dob) " +
                "VALUES(1, ?, ?, ?, ?, ?, ?);",
                [user_name, gender, name, password, mobile, dob],
                function (err, result) {
                    if (err)
                        throw err;
                    resolve(result["insertId"]);
                }
            );
        });
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

    static async is_existing_user(mobile, user_name) {
        return new Promise((resolve, reject) => con.query(
            "SELECT client_id FROM phoenixOauth.users " +
            "WHERE (mobile=? OR user_name=?) AND status=1 LIMIT 1;",
            [mobile, user_name],
            function (err, result) {
                if (err) throw err;
                resolve(result.length === 1);
            }));
    }

}

module.exports = Users;