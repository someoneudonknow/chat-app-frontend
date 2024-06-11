import { io } from "socket.io-client";

const URL =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SOCKET_BASE_URL_PROD
    : import.meta.env.VITE_SOCKET_BASE_URL_DEV;

const socket = io(URL, {
  transports: ["websocket", "polling", "flashsocket"],
  autoConnect: false,
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("connect_error", (err) => {
  console.log("Socket error::", err.stack);
});

export default socket;
