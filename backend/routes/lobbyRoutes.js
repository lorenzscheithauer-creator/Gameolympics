import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getPublicLobbies, createLobby, joinLobby, joinRandomLobby, startGame, getCurrentLobby, leaveLobby } from '../controllers/lobbyController.js';

const router = express.Router();

// Get the current lobby for the user
router.get('/current', protect, getCurrentLobby);

// Get list of public lobbies
router.get('/', getPublicLobbies);

// Create a new lobby
router.post('/create', protect, createLobby);

// Start a game
router.post('/:lobbyCode/start', protect, startGame);

// Join a lobby by code
router.post('/join/code', protect, joinLobby);

// Join a random lobby
router.post('/join/random', protect, joinRandomLobby);

// Leave the current lobby
router.post('/leave', protect, leaveLobby);

export default router;
