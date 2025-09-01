import { promisify } from 'util';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import generateToken from '../utils/generateToken.js';

// Promisify db methods for modern async/await usage
const dbGet = promisify(db.get.bind(db));
const dbRun = promisify(db.run.bind(db));


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400);
            return next(new Error('Please add all fields'));
        }

        const sqlCheck = `SELECT * FROM users WHERE username = ? OR email = ?`;
        const existingUser = await dbGet(sqlCheck, [username, email]);

        if (existingUser) {
            res.status(409);
            if (existingUser.username === username) {
                return next(new Error('Dieser Benutzername ist bereits vergeben.'));
            } else {
                return next(new Error('Diese E-Mail-Adresse wird bereits verwendet.'));
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const sqlInsert = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;

        // db.run's callback for `this.lastID` is tricky with promisify.
        // We'll need a custom promise wrapper for it.
        const runResult = await new Promise((resolve, reject) => {
            db.run(sqlInsert, [username, email, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });

        const token = generateToken(runResult.lastID);
        res.status(201).json({
            token: token,
            user: {
                username: username,
                email: email
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400);
            // Using next() to pass to the error handler middleware
            return next(new Error('Please provide username and password'));
        }

        const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
        const user = await dbGet(sql, [username, username]);

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const token = generateToken(user.id);
            res.json({
                token: token,
                user: {
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            res.status(401);
            // Using next() to be consistent with error handling
            return next(new Error('Ungültige Anmeldedaten'));
        }
    } catch (error) {
        // Pass any other errors (e.g., from dbGet) to the error handler
        next(error);
    }
};

// @desc    Login as a guest
// @route   POST /api/users/guest-login
// @access  Public
const loginGuest = (req, res, next) => {
    try {
        const { nickname } = req.body;
        if (!nickname) {
            res.status(400);
            throw new Error('Please provide a nickname');
        }
        // For guests, we can generate a "guest" token with limited info
        const guestToken = jwt.sign({ nickname, isGuest: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            nickname: nickname,
            isGuest: true,
            token: guestToken
        });
    } catch(error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // The protect middleware already attached the user to the request
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

export { registerUser, authUser, loginGuest, getUserProfile };
