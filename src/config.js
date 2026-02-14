// src/config.js

export const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://vms-backend-ctea.onrender.com/api";

export const SOCKET_BASE_URL =
    import.meta.env.VITE_SOCKET_URL ||
    "https://vms-backend-ctea.onrender.com";
