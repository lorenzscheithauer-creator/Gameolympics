import axios from 'axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/lobbies',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getLobbies = () => {
  return apiClient.get('/', { headers: getAuthHeaders() });
};

export const createLobby = (lobbyData: { lobbyName: string; isPublic: boolean; password?: string }) => {
  return apiClient.post('/create', lobbyData, { headers: getAuthHeaders() });
};

export const joinLobby = (joinData: { lobbyCode: string; password?: string }) => {
  return apiClient.post('/join/code', joinData, { headers: getAuthHeaders() });
};

export const joinRandomLobby = () => {
  return apiClient.post('/join/random', null, { headers: getAuthHeaders() });
};

export const startGame = (lobbyCode: string) => {
  return apiClient.post(`/${lobbyCode}/start`, null, { headers: getAuthHeaders() });
};

export const getCurrentLobby = () => {
  return apiClient.get('/current', { headers: getAuthHeaders() });
};

export const leaveLobby = () => {
  return apiClient.post('/leave', null, { headers: getAuthHeaders() });
};

export default {
  getLobbies,
  createLobby,
  joinLobby,
  joinRandomLobby,
  startGame,
  getCurrentLobby,
  leaveLobby,
};
