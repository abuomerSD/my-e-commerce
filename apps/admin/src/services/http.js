import axios from "axios";
import { VITE_API_BASE_URL } from "../config/env";

// create an axios instance

const obj = axios.create({
  baseURL: VITE_API_BASE_URL || "http://localhost:5001/api",
});

const http = {
  get: async (url) => {
    await obj.get(url).then((res) => {
      return res;
    });
  },
};

export default http;
