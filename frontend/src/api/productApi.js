import axios from "../axiosClient";

const API_URL = "/products";

export async function getProduct(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createProduct(data) {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
}

export async function deleteProduct(id) {
  await axios.delete(`${API_URL}/${id}`);
}
