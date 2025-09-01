import axios from 'axios';

// Create an Axios instance for API requests
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/users', // Backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = (userData: any) => {
  return apiClient.post('/register', userData);
};

export const login = (credentials: any) => {
  return apiClient.post('/login', credentials);
};

// You could add more functions here, e.g., for fetching user data
// or for adding the auth token to headers for protected requests.

export default {
  register,
  login,
};
