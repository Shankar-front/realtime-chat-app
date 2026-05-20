import { io } from "socket.io-client";

export const socket = io(
  "https://chat-backend-nqrw.onrender.com/"
);