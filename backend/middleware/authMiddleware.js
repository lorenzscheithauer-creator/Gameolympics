import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if it's a guest token
      if (decoded.isGuest) {
          req.user = { nickname: decoded.nickname, isGuest: true };
          return next();
      }

      // Get user from the db
      const sql = `SELECT id, username, email FROM users WHERE id = ?`;
      db.get(sql, [decoded.id], (err, user) => {
        if (err) {
          res.status(500);
          return next(new Error('Server error authenticating user'));
        }
        if (!user) {
          res.status(401);
          return next(new Error('Not authorized, user not found'));
        }

        req.user = user;
        next();
      });

    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

export { protect };
