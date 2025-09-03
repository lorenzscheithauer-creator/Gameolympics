import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPublicLobbies, createLobby, joinLobby, joinRandomLobby } from '../controllers/lobbyController.js';

const router = express.Router();

// Get list of public lobbies
router.get('/', getPublicLobbies);

// Create a new lobby
router.post('/create', protect, createLobby);

// Join a lobby by code
router.post('/join/code', protect, joinLobby);

// Join a random lobby
router.post('/join/random', protect, joinRandomLobby);

export default router;
