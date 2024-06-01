const db = require("./dbConnection");

class User {
  constructor(id, name, age, username, password, session_uuid) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.username = username;
    this.password = password;
    this.session_uuid = session_uuid;
  }

  static async findOne({ id, username }) {
    const row = await db.getrow(
      "SELECT * FROM users WHERE id = ? OR username = ?",
      [id, username],
    );
    if (!row) return null;

    return new User(...Object.values(row));
  }

  static async findManyOlderThanAge(age) {
    const rows = await db.getall("SELECT * FROM users WHERE age > ?", [age]);
    return rows.map((row) => new User(...Object.values(row)));
  }

  static async findById(id) {
    const row = await db.getrow("SELECT * FROM users WHERE id = ?", [id]);
    if (!row) return null;

    return new User(...Object.values(row));
  }

  static async findByUsername(username) {
    const row = await db.getrow("SELECT * FROM users WHERE id = ?", [username]);
    if (!row) return null;

    return new User(...Object.values(row));
  }

  async save() {
    const result = await db.query(
      "INSERT INTO users (name, age, username, password, session_uuid) VALUES (?, ?, ?, ?, ?)",
      [this.name, this.age, this.username, this.password, this.session_uuid],
    );

    this.id = result.insertId;
  }

  async delete() {
    await db.query("DELETE FROM users WHERE id = ?", [this.id]);
  }

  async update() {
    await db.update(
      "UPDATE users SET name = ?, age = ?, username = ?, password = ?, session_uuid = ? WHERE id = ?",
      [
        this.name,
        this.age,
        this.username,
        this.password,
        this.session_uuid,
        this.id,
      ],
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      username: this.username,
    };
  }
}

module.exports = User;
