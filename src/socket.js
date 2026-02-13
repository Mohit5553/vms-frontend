
// import { io } from "socket.io-client";
// import { SOCKET_BASE_URL } from "./config";

// export const socket = io(SOCKET_BASE_URL, {
//     withCredentials: true,
// });

import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "./config";

export const createSocket = () => {
    return io(SOCKET_BASE_URL, {
        transports: ["websocket"],
        reconnection: true,
    });
};
