import express from 'express';
import { getPublicLobbies, createLobby, joinLobby, joinRandomLobby } from '../controllers/lobbyController.js';

const router = express.Router();

router.get('/list', getPublicLobbies);
router.post('/create', createLobby);
router.post('/join', joinLobby);
router.post('/join/random', joinRandomLobby);

export default router;
