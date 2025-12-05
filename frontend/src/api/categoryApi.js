import axios from "../axiosClient";

const API_URL = "/categories";

export async function getCategories() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function createCategory(data) {
  const response = await axios.post(API_URL, data);
  return response.data;
}

export async function deleteCategory(id) {
  await axios.delete(`${API_URL}/${id}`);
}
