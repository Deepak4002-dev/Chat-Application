import axios from "axios";
import { getStore } from "../app/store/storeRef";
import { resetAuth } from "../rtk/auth/authSlice";
import { connectSocket, disconnectSocket } from "../rtk/socket/socketThunk";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60s — accounts for Render free tier cold start
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    // error.config
    //error.response
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("auth/refresh") &&
      !originalRequest.url.includes("auth/login") &&
      !originalRequest.url.includes("auth/signup")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      console.log("🔄 Access token expired — attempting silent refresh...");

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        
        await API.post("/auth/refresh");
        console.log("✅ Silent refresh SUCCESS — retrying original request");
        processQueue(null);
        const user = getStore()?.getState()?.auth?.user;
        if (user?._id) {
          getStore()?.dispatch(disconnectSocket());
          getStore()?.dispatch(connectSocket(user._id));
        }

        return API(originalRequest);

      } catch (refreshError) {

        console.log("❌ Silent refresh FAILED — redirecting to login");
        processQueue(refreshError);
        getStore()?.dispatch(resetAuth());
        getStore()?.dispatch(disconnectSocket());
        window.location.href = "/";
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default API;
