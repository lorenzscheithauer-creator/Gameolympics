import axios from 'axios';

// Create an Axios instance for API requests to the lobby endpoints
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/lobbies', // Backend lobby API base URL
  headers: {
    'Content-Type': 'application/json',
    // TODO: Add Authorization header with token if needed
  },
});

export const createLobby = (lobbyData: { lobbyName: string; isPublic: boolean; password?: string }) => {
  return apiClient.post('/create', lobbyData);
};

export const joinLobby = (joinData: { lobbyCode: string; password?: string }) => {
  return apiClient.post('/join', joinData);
};

export const joinRandomLobby = () => {
  return apiClient.post('/join/random');
};

export const getLobbies = () => {
  return apiClient.get('/list');
};

export default {
  getLobbies,
  createLobby,
  joinLobby,
  joinRandomLobby,
};
