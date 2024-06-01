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

    async save() {
        const result = await db.query(
            'INSERT INTO users (name, age, username, password, session_uuid) VALUES (?, ?, ?, ?, ?)',
            [this.name, this.age, this.username, this.password, this.session_uuid]
        )

        this.id = result.insertId;
    }
}

module.exports = User;