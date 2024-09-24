// axiosInstance.ts
import axios from "axios";
import { backend_url } from "./URL";
import { getToken } from "./authUtils";
import { logout } from "@/app/actions/auth";

const axiosInstance = axios.create({
  baseURL: backend_url,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupAxiosInterceptors = async (logout: () => void) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 403) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
