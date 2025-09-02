import express from 'express';
import { getPublicLobbies, createLobby, joinLobby, joinRandomLobby } from '../controllers/lobbyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/list', getPublicLobbies); // This can remain public
router.post('/create', protect, createLobby);
router.post('/join', protect, joinLobby);
router.post('/join/random', protect, joinRandomLobby);

export default router;
