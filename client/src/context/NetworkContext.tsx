import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

type Props = {
  children: React.ReactNode;
};

export interface User {
  username: string;
}

export interface Room {
  members: User[];
  name: string;
}

interface NetworkValues {
  users: User[];
  rooms: Room[];
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
  sendMessage: () => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  rooms: [],
  connectToRoom: () => {},
  disconnectFromRoom: () => {},
  sendMessage: () => {},
});

const NetworkProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const socket: SocketIOClient.Socket = io.connect("http://localhost:4000", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("test", (id: string) => {
      console.log("Your ID is: " + id);
    });
  }, []);

  const connectToRoom = () => {};
  const disconnectFromRoom = () => {};
  const sendMessage = () => {};

  return (
    <NetworkContext.Provider
      value={{ users, rooms, connectToRoom, disconnectFromRoom, sendMessage }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
