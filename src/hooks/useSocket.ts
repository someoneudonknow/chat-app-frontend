import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const useSocket = () => useContext(SocketContext);

export default useSocket;
