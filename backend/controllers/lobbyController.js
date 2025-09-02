import bcrypt from 'bcrypt';
import lobbies from '../data/lobbies.js';

const MAX_PLAYERS = 8;

// A simple utility to generate a random 6-character code
const generateLobbyCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// @desc    Get all public, non-full lobbies
// @route   GET /api/lobbies
// @access  Public
const getPublicLobbies = async (req, res, next) => {
  try {
    const publicLobbies = lobbies
      .filter(l => l.isPublic && l.players.length < MAX_PLAYERS)
      .map(l => ({
        lobbyCode: l.lobbyCode,
        hostName: l.players[0]?.username || 'Unknown', // The first player is the host
        playerCount: l.players.length,
        maxPlayers: MAX_PLAYERS,
      }));
    res.status(200).json(publicLobbies);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new lobby
// @route   POST /api/lobbies/create
// @access  Private (TODO: Add auth middleware)
const createLobby = async (req, res, next) => {
  try {
    const { isPublic, password } = req.body;
    const creatingPlayer = { id: 'player1', username: 'HostPlayer' }; // Placeholder

    if (isPublic === undefined) {
      res.status(400);
      throw new Error('Please specify if the lobby is public or private.');
    }

    const newLobby = {
      lobbyCode: generateLobbyCode(),
      isPublic: isPublic,
      players: [creatingPlayer],
      passwordHash: null,
    };

    if (!isPublic) {
      if (!password) {
        res.status(400);
        throw new Error('Private lobbies require a password.');
      }
      const salt = await bcrypt.genSalt(10);
      newLobby.passwordHash = await bcrypt.hash(password, salt);
    }

    lobbies.push(newLobby);
    console.log('Lobbies currently in memory:', lobbies);

    res.status(201).json({
      message: 'Lobby created successfully',
      lobbyCode: newLobby.lobbyCode,
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Join a lobby with a code
// @route   POST /api/lobbies/join
// @access  Private (TODO: Add auth middleware)
const joinLobby = async (req, res, next) => {
  try {
    const { lobbyCode, password } = req.body;
    const joiningPlayer = { id: 'player2', username: 'JoiningPlayer' }; // Placeholder

    if (!lobbyCode) {
      res.status(400);
      throw new Error('Lobby code is required.');
    }

    const lobby = lobbies.find(l => l.lobbyCode === lobbyCode);

    if (!lobby) {
      res.status(404);
      throw new Error('Lobby not found.');
    }

    if (lobby.players.length >= MAX_PLAYERS) {
      res.status(403);
      throw new Error('Lobby is full.');
    }

    if (!lobby.isPublic) {
      if (!password) {
        res.status(401);
        throw new Error('Password is required for this private lobby.');
      }
      const isMatch = await bcrypt.compare(password, lobby.passwordHash);
      if (!isMatch) {
        res.status(401);
        throw new Error('Invalid password.');
      }
    }

    lobby.players.push(joiningPlayer);
    console.log(`Player joined lobby ${lobbyCode}. Lobbies:`, lobbies);

    res.status(200).json({ message: 'Successfully joined lobby.', lobby });

  } catch (error) {
    next(error);
  }
};

// @desc    Join a random public lobby
// @route   POST /api/lobbies/join/random
// @access  Private (TODO: Add auth middleware)
const joinRandomLobby = async (req, res, next) => {
  try {
    const joiningPlayer = { id: 'player3', username: 'RandomPlayer' }; // Placeholder

    const availableLobbies = lobbies.filter(l => l.isPublic && l.players.length < MAX_PLAYERS);

    if (availableLobbies.length === 0) {
      res.status(404);
      throw new Error('No available public lobbies found.');
    }

    const randomLobby = availableLobbies[Math.floor(Math.random() * availableLobbies.length)];
    randomLobby.players.push(joiningPlayer);

    console.log(`Player joined random lobby ${randomLobby.lobbyCode}. Lobbies:`, lobbies);

    res.status(200).json({ message: 'Successfully joined random lobby.', lobby: randomLobby });

  } catch (error) {
    next(error);
  }
};

export {
  getPublicLobbies,
  createLobby,
  joinLobby,
  joinRandomLobby,
};
