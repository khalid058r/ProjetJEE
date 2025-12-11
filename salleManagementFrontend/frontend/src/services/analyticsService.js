import api from "./api";

const AnalyticsService = {

  getGlobalKpi: () => api.get("/analytics/kpi"),
  getMonthlySales: () => api.get("/analytics/sales/monthly"),
  getDailySales: (start, end) =>
    api.get("/analytics/sales/daily", { params: { start, end } }),
  getBestSellers: (limit = 5) =>
    api.get("/analytics/products/best-sellers", { params: { limit } }),
  getSlowMovers: () => api.get("/analytics/products/slow-movers"),
  getLowStock: () => api.get("/analytics/products/low-stock"),
  getCategoryStats: () => api.get("/analytics/categories"),
  getCurrentMonthEvolution: () =>
    api.get("/analytics/evolution/current-month"),
  getBasketStats: () => api.get("/analytics/basket/stats"),
};

export default AnalyticsService;
