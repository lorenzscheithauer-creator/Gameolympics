import express from 'express';
const router = express.Router();
import {
  registerUser,
  authUser,
  loginGuest,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/guest-login', loginGuest);
router.get('/profile', protect, getUserProfile);

export default router;
