import api from "./api";

export const getKpi = () => api.get("/analytics/kpi");
export const getMonthlySales = () => api.get("/analytics/sales/monthly");
export const getDailySales = (start, end) =>
  api.get(`/analytics/sales/daily?start=${start}&end=${end}`);

export const getBestSellers = (limit = 10) =>
  api.get(`/analytics/products/best-sellers?limit=${limit}`);

export const getSlowMovers = (max = 5, limit = 10) =>
  api.get(`/analytics/products/slow-movers?maxSold=${max}&limit=${limit}`);

export const getLowStock = (th = 5) =>
  api.get(`/analytics/products/low-stock?threshold=${th}`);

export const getCategoryStats = () => api.get("/analytics/categories");

export const getGrowth = () => api.get("/analytics/evolution/current-month");

export const getBasketStats = () => api.get("/analytics/basket/stats");
