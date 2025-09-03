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
      hostId: creatingPlayer.id,
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
    res.status(201).json(newLobby);
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

    if (lobby.players.length === MAX_PLAYERS) {
      initiateGameStart(lobby);
    }

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

    if (randomLobby.players.length === MAX_PLAYERS) {
      initiateGameStart(randomLobby);
    }

    res.status(200).json({ message: 'Successfully joined random lobby.', lobby: randomLobby });
  } catch (error) {
    next(error);
  }
};

const initiateGameStart = (lobby) => {
  // This is where the game logic would be triggered.
  // For now, we'll just mark the lobby as started.
  lobby.gameStarted = true;
  console.log(`Game has been started for lobby: ${lobby.lobbyName} (${lobby.lobbyCode})`);
};

const startGame = async (req, res, next) => {
  try {
    const { lobbyCode } = req.params;
    const user = req.user;

    const lobby = lobbies.find(l => l.lobbyCode === lobbyCode);

    if (!lobby) {
      res.status(404);
      throw new Error('Lobby not found.');
    }

    // Authorization: Check if user is the host
    const host = lobby.players[0];
    if (host.id !== user.id) {
      res.status(403);
      throw new Error('Only the host can start the game.');
    }

    // Rule: Check for minimum players
    if (lobby.players.length < 2) {
      res.status(409);
      throw new Error('Not enough players to start the game.');
    }

    initiateGameStart(lobby);

    res.status(200).json({ message: 'Game started successfully.', lobby });

  } catch (error) {
    next(error);
  }
};

const getCurrentLobby = async (req, res, next) => {
  try {
    const user = req.user;
    const lobby = lobbies.find(l => l.players.some(p => p.id === user.id));

    if (!lobby) {
      res.status(404);
      throw new Error('You are not currently in a lobby.');
    }

    res.status(200).json(lobby);
  } catch (error) {
    next(error);
  }
};

const leaveLobby = async (req, res, next) => {
  try {
    const user = req.user;
    const lobbyIndex = lobbies.findIndex(l => l.players.some(p => p.id === user.id));

    if (lobbyIndex === -1) {
      res.status(404);
      throw new Error('You are not currently in a lobby.');
    }

    const lobby = lobbies[lobbyIndex];

    // Remove the player from the lobby
    lobby.players = lobby.players.filter(p => p.id !== user.id);

    // If the lobby is now empty, remove it. Otherwise, if the host left, assign a new host.
    if (lobby.players.length === 0) {
      lobbies.splice(lobbyIndex, 1);
    } else if (lobby.hostId === user.id) {
      lobby.hostId = lobby.players[0].id; // Assign the next player as host
    }

    res.status(200).json({ message: 'Successfully left the lobby.' });
  } catch (error) {
    next(error);
  }
};

export {
  getPublicLobbies,
  createLobby,
  joinLobby,
  joinRandomLobby,
  startGame,
  getCurrentLobby,
  leaveLobby,
};
