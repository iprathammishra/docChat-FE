import axios from "axios";
import jwt_decode from "jwt-decode";
import { REACT_APP_BASE_URL, BASE_URL } from "../utils/config";

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    const decoded = jwt_decode(token);
    const expiryDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();
    const differenceInMins = (expiryDate - currentDate) / 1000 / 60 / 60;
    if (differenceInMins <= 24) {
      const res = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newToken = res.data.newToken;
      localStorage.setItem("accessToken", newToken);
    }
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 440) {
      localStorage.removeItem("userId");
      localStorage.removeItem("accessToken");
      alert(error.response.data.message);
      window.location.href = `${REACT_APP_BASE_URL}/auth/login`;
    }
    return Promise.reject(error);
  }
);
