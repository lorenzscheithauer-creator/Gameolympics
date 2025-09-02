import express from 'express';
import { createLobby, joinLobby, joinRandomLobby } from '../controllers/lobbyController.js';

const router = express.Router();

router.post('/create', createLobby);
router.post('/join', joinLobby);
router.post('/join/random', joinRandomLobby);

export default router;
