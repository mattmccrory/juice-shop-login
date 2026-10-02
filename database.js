
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const db = new Database('users.db');

// Create users table
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
`);

// Create a demonstration user
async function initializeDatabase() {
    const email = 'test@example.com';
    const password = 'Password123';

    const existingUser = db.prepare(
        'SELECT id FROM users WHERE email = ?'
    ).get(email);

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 12);

        db.prepare(
            'INSERT INTO users (email, password) VALUES (?, ?)'
        ).run(email, hashedPassword);
    }
}

module.exports = { db, initializeDatabase };
