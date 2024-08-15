import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "../store";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "../constants";

type SocketContextType = {
  socket: Socket | null;
};

type SocketProviderPropsType = {
  children: ReactNode;
};

const initVal: SocketContextType = {
  socket: null,
};

export const SocketContext = createContext<SocketContextType>(initVal);

const URL =
  import.meta.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SOCKET_BASE_URL_PROD
    : import.meta.env.VITE_SOCKET_BASE_URL_DEV;

const SocketProvider: React.FC<SocketProviderPropsType> = ({ children }) => {
  const [userSocket, setUserSocket] =
    useState<SocketContextType["socket"]>(null);
  const accessToken = Cookies.get(ACCESS_TOKEN);
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?._id
  );

  const startListeners = useCallback((socket: Socket) => {
    socket.io.on("reconnect_attempt", (attempt) => {
      console.log("Reconnecting ", attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.log("Recconection error", error);
    });

    socket.on("connect", () => {
      console.log("Socket connect successfully");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.log("Socket error::", err.stack);
    });
  }, []);

  const clearSocketState = () => {
    userSocket?.disconnect();
    setUserSocket(null);
  };

  useEffect(() => {
    if (accessToken && currentUserId) {
      const socket = io(URL, {
        autoConnect: true,
        extraHeaders: {
          Authorization: accessToken,
          ["x-client-id"]: currentUserId,
        },
      });

      startListeners(socket);

      setUserSocket(socket);
    } else {
      clearSocketState();
    }

    return () => {
      clearSocketState();
    };
    //eslint-disable-next-line
  }, [accessToken, currentUserId, startListeners]);

  const _value = useMemo<SocketContextType>(
    () => ({
      socket: userSocket,
    }),
    [userSocket]
  );

  return (
    <SocketContext.Provider value={_value}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
