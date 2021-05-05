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
  setUsername: (username: string) => void;
  createRoom: (roomName: string) => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  rooms: [],
  connectToRoom: () => {},
  disconnectFromRoom: () => {},
  sendMessage: () => {},
  setUsername: () => {},
  createRoom: () => {},
});

const NetworkProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room>();

  const socket: SocketIOClient.Socket = io.connect("http://localhost:4000", {
    transports: ["websocket"],
  });

  useEffect(() => {
    socket.on("user", (user: []) => {
      console.log("your userarray is: " + user);
    });
  }, []);

  const connectToRoom = () => {};
  const disconnectFromRoom = () => {};
  const sendMessage = () => {};
  const setUsername = (username: string) => {
    socket.emit("username", username);
  };
  const createRoom = (roomName: string) => {
    socket.emit("create", roomName);
  };

  return (
    <NetworkContext.Provider
      value={{
        users,
        rooms,
        connectToRoom,
        disconnectFromRoom,
        sendMessage,
        setUsername,
        createRoom,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
