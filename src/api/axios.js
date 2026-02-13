// import axios from "axios";

// export default axios.create({
//   baseURL: "http://localhost:5000/api",
//   baseURL: "https://vms-backend-ctea.onrender.com/api",

// });
// import axios from "axios";

// // ✅ FOR LOCAL
// // const BASE_URL = "http://localhost:5000/api";

// // ✅ FOR ONLINE
// const BASE_URL = "https://vms-backend-ctea.onrender.com/api";

// export default axios.create({
//   baseURL: BASE_URL,
// });
// import axios from "axios";

// const baseURL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// export default axios.create({
//   baseURL,
// });
// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   withCredentials: true, // very important for login cookies
// });

// const API_URL = import.meta.env.VITE_API_URL;

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   withCredentials: true
// });


// export default api;


// import axios from "axios";
// import { API_BASE_URL } from "../config";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
// });

// export default api;

import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 🔐 Automatically attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
