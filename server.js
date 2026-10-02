
const express = require('express');
const bcrypt = require('bcrypt');
const { db, initializeDatabase } = require('./database');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Server-side validation
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.includes('@') ||
        password.length < 8
    ) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email or password format.'
        });
    }

    try {
        // Parameterized query prevents SQL injection
        const user = db.prepare(
            'SELECT * FROM users WHERE email = ?'
        ).get(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Compare submitted password with stored hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        return res.json({
            success: true,
            message: 'Login successful!'
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.'
        });
    }
});

// Start server after database initialization
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Database initialization failed:', error);
    process.exit(1);
});
