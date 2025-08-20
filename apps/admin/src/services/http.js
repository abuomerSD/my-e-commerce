import axios from "axios";
import { VITE_API_BASE_URL } from "../config/env";

// create an axios instance

const axiosInstance = axios.create({
  baseURL: VITE_API_BASE_URL || "http://localhost:5001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const http = {
  get: async (url) => {
    try {
      const res = await axiosInstance.get(url);
      return res.data;
    } catch (error) {
      console.log(error.message);
    }
  },
  post: async (url, data) => {
    try {
      const res = await axiosInstance.post(url, data);
      return res.data;
    } catch (error) {
      console.log(error.message);
    }
  },
  put: async (url, id, data) => {
    url += `/${id}`;
    try {
      const res = await axiosInstance.put(url, data);
      return res.data;
    } catch (error) {
      console.log(error.message);
    }
  },
  delete: async (url, id) => {
    url += `/${id}`;
    try {
      const res = await axiosInstance.delete(url);
      return res.data;
    } catch (error) {
      console.log(error.message);
    }
  },
};

export default http;
