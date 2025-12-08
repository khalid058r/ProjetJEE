import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(username, email, password, role) {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      role
    });
    return response.data;
  }
};