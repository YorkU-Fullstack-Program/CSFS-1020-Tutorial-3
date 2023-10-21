const db = require('./dbConnection');


class User {
    constructor(id, name, age, username, password, session_uuid) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.username = username;
        this.password = password;
        this.session_uuid = session_uuid;
    }

    static async findById(id) {
        const row = await db.getrow("SELECT * FROM users WHERE id = ?", [id]);
        if (row) {
            return new User(...Object.values(row));
        }
        return null;
    }
}

module.exports = User;