const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const session = require('express-session');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Crash logging
const logStream = fs.createWriteStream(path.join(__dirname, 'crash.log'), { flags: 'a' });
process.on('uncaughtException', (err) => {
    logStream.write(`Uncaught Exception: ${err.stack || err}\n`);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logStream.write(`Unhandled Rejection at: ${promise}, reason: ${reason}\n`);
    process.exit(1);
});


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.static('../frontend'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'a-very-secret-key', // Should be in an env var
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For production, use 'auto' or true with HTTPS
}));

// Database connection
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

// API Endpoints

// Register a new user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;

        db.run(sql, [username, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Username or email already exists.' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User created successfully.', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// Login a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password.' });
    }

    // Allow login with either username or email
    const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(sql, [username, username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            req.session.user = { id: user.id, username: user.username };
            res.status(200).json({ message: 'Login successful.', user: req.session.user });
        } else {
            res.status(401).json({ error: 'Invalid credentials.' });
        }
    });
});

// Guest login
app.post('/guest-login', (req, res) => {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Please provide a nickname.' });
    }

    req.session.guest = { nickname };
    res.status(200).json({ message: 'Guest login successful.', guest: req.session.guest });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
