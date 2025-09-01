import express from 'express';
const router = express.Router();
import {
  registerUser,
  authUser,
  loginGuest,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

router.post(
  '/register',
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 8 characters long').isLength({
    min: 8,
  }),
  body('username', 'Username is required').not().isEmpty(),
  registerUser
);

router.post(
  '/login',
  body('username', 'Username is required').not().isEmpty(),
  body('password', 'Password is required').not().isEmpty(),
  authUser
);
router.post('/guest-login', loginGuest);
router.get('/profile', protect, getUserProfile);

export default router;
