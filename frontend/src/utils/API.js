import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials:true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);

  },
);

API.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    let originalRequest = error.config;

    if(error.response?.status===401 && originalRequest)
  },
);

export default API;
