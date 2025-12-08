import api from './api';

export const saleService = {
  async getAll() {
    const response = await api.get('/sales');
    return response.data;
  },

  async getPaginated(page = 0, size = 10) {
    const response = await api.get('/sales/page', {
      params: { page, size }
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  async create(saleData) {
    // saleData: { userId, lignes: [{ productId, quantity }] }
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  async cancel(id) {
    const response = await api.post(`/sales/${id}/cancel`);
    return response.data;
  },

  async delete(id) {
    await api.delete(`/sales/${id}`);
  }
};