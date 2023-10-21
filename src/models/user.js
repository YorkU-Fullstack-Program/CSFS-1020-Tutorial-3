const db = require('./dbConnection');
const argon2 = require('argon2');


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

    static async findByUsername(username) {
        const row = await db.getrow("SELECT * FROM users WHERE username = ?", [username]);
        if (row) {
            return new User(...Object.values(row));
        }
        return null;
    }

    async save() {
        const result = await db.query("INSERT INTO users (name, age, username, password, session_uuid) VALUES (?, ?, ?, ?, ?)", [this.name, this.age, this.username, this.password, this.session_uuid]);
        this.id = result.insertId;
    }

    async update() {
        await db.update("UPDATE users SET name = ?, age = ?, username = ?, password = ?, session_uuid = ? WHERE id = ?", [this.name, this.age, this.username, this.password, this.session_uuid, this.id]);
    }

    async logout() {
        await db.update("UPDATE users SET session_uuid = ? WHERE id = ?", [v4(), this.id]);
    }

    async isPasswordValid(password) {
        return await argon2.verify(this.password, password)
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            age: this.age,
            username: this.username,
        }
    }
}


module.exports = User;