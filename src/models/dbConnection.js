const Db = require('mysql2-async').default;

const db = new Db({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydb',
});

module.exports = db;