// import { io } from "socket.io-client";
// export const socket = io("http://localhost:5000");
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.env.production.VITE_API_URL;

export const socket = io(SOCKET_URL, {
    withCredentials: true,
});
