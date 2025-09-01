import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        const sqlCheck = `SELECT * FROM users WHERE username = ? OR email = ?`;
        db.get(sqlCheck, [username, email], async (err, user) => {
            if (err) {
                res.status(500);
                return next(new Error('Server error during user check'));
            }
            if (user) {
                res.status(409);
                if (user.username === username) {
                    return next(new Error('Dieser Benutzername ist bereits vergeben.'));
                } else {
                    return next(new Error('Diese E-Mail-Adresse wird bereits verwendet.'));
                }
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const sqlInsert = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
            db.run(sqlInsert, [username, email, hashedPassword], function (err) {
                if (err) {
                    res.status(500);
                    return next(new Error('Server error during registration'));
                }
                res.status(201).json({
                    _id: this.lastID,
                    username: username,
                    email: email,
                    token: generateToken(this.lastID)
                });
            });
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
        const { username, password } = req.body; // Can be username or email

        const sql = `SELECT * FROM users WHERE username = ? OR email = ?`;
        db.get(sql, [username, username], async (err, user) => {
            if (err) {
                res.status(500);
                return next(new Error('Server error'));
            }

            if (user && (await bcrypt.compare(password, user.password_hash))) {
                res.json({
                    _id: user.id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user.id),
                });
            } else {
                res.status(401);
                return next(new Error('Invalid credentials'));
            }
        });
    } catch (error) {
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
        const guestToken = jwt.sign({ nickname, isGuest: true }, 'your_jwt_secret', { expiresIn: '1h' });
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
