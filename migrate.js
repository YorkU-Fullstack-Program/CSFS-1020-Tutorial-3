const db = require('./src/models/dbConnection');
const fs = require('fs').promises;
const path = require('path');

const migrate = async () => {
    const migrations = await fs.readdir(path.join(__dirname, 'migrations'));

    for (const migration of migrations) {
        const fileContent = await fs.readFile(path.join(__dirname, 'migrations', migration), 'utf-8');
        await db.query(fileContent);
    }
}

migrate().then(() => {
    console.log('Migration completed');
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});