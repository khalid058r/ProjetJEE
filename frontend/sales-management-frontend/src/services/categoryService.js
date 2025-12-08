import api from './api';

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getPaginated(page = 0, size = 10, sortBy = 'name') {
    const response = await api.get('/categories/page', {
      params: { page, size, sortBy }
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/categories/${id}`);
  }
};