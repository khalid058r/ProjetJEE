import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => {
    // data : { email, password }
    return axiosClient.post("/api/auth/login", data);
  },

  register: (data) => {
    // data : { username, email, password, role }
    return axiosClient.post("/api/auth/register", data);
  },
};

export default authApi;
