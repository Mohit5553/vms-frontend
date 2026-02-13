// src/config.js

const BASE_URL = import.meta.env.VITE_API_URL;
console.log("ENV VALUE:", import.meta.env.VITE_API_URL);

export const API_BASE_URL = `${BASE_URL}/api`;
export const SOCKET_BASE_URL = BASE_URL;
