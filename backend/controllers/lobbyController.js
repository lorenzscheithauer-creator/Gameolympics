import bcrypt from 'bcrypt';
import lobbies from '../data/lobbies.js';

const MAX_PLAYERS = 6;

const isPlayerInAnyLobby = (playerId) => {
  return lobbies.some(lobby => lobby.players.some(player => player.id === playerId));
};

const generateLobbyCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const getPublicLobbies = async (req, res, next) => {
  try {
    const publicLobbies = lobbies
      .filter(l => l.isPublic && l.players.length < MAX_PLAYERS)
      .map(l => ({
        lobbyCode: l.lobbyCode,
        lobbyName: l.lobbyName,
        hostName: l.players[0]?.username || 'Unknown',
        playerCount: l.players.length,
        maxPlayers: MAX_PLAYERS,
      }));
    res.status(200).json(publicLobbies);
  } catch (error) {
    next(error);
  }
};

const createLobby = async (req, res, next) => {
  try {
    const { isPublic, password, lobbyName } = req.body;
    const user = req.user;

    if (isPlayerInAnyLobby(user.id)) {
      res.status(400);
      throw new Error('You are already in a lobby.');
    }

    if (isPublic === undefined) {
      res.status(400);
      throw new Error('Please specify if the lobby is public or private.');
    }

    const creatingPlayer = { id: user.id, username: user.username };

    const newLobby = {
      lobbyCode: generateLobbyCode(),
      lobbyName: lobbyName || `${user.username}'s Lobby`,
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
    res.status(201).json({
      message: 'Lobby created successfully',
      lobbyCode: newLobby.lobbyCode,
    });
  } catch (error) {
    next(error);
  }
};

const joinLobby = async (req, res, next) => {
  try {
    const { lobbyCode, password } = req.body;
    const user = req.user;

    if (isPlayerInAnyLobby(user.id)) {
      res.status(400);
      throw new Error('You are already in a lobby.');
    }

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
        throw new Error('Falsches Passwort');
      }
    }

    const joiningPlayer = { id: user.id, username: user.username };
    lobby.players.push(joiningPlayer);

    res.status(200).json({ message: 'Successfully joined lobby.', lobby });
  } catch (error) {
    next(error);
  }
};

const joinRandomLobby = async (req, res, next) => {
  try {
    const user = req.user;

    if (isPlayerInAnyLobby(user.id)) {
      res.status(400);
      throw new Error('You are already in a lobby.');
    }

    const availableLobbies = lobbies.filter(l => l.isPublic && l.players.length < MAX_PLAYERS);

    if (availableLobbies.length === 0) {
      res.status(404);
      throw new Error('No available public lobbies found.');
    }

    const randomLobby = availableLobbies[Math.floor(Math.random() * availableLobbies.length)];
    const joiningPlayer = { id: user.id, username: user.username };
    randomLobby.players.push(joiningPlayer);

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
