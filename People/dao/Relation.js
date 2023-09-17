const db_connection = require("../external/condb");
const logger = require("../logger");
const con = db_connection();
class People {
    constructor(user_id, relation_id, created_at, updated_at) {
        this.user_id = user_id;
        this.friend_id = relation_id
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async get_all_friends (userId){
        con.query(
            "SELECT relation_id from phoenixPeople.friends" + 
            "WHERE (user_id = ?)",
            [userId], 
            (err, res) => {
                if (!result.length)
                    resolve(null);
                resolve(result[0]);
            }
        );
    }

    static async get_all_blocked (userId){
        con.query(
            "SELECT friend_id from phoenixPeople.blocked" + 
            "WHERE (user_id = ?)",
            [userId], 
            (err, res) => {
                if (!result.length)
                    resolve(null);
                resolve(result[0]);
            }
        );
    }
}