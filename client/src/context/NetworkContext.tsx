import { createContext, useEffect, useRef, useState } from "react";
import SocketIO from "socket.io";
import io from "socket.io-client";

type Props = {
  children: React.ReactNode;
};

export interface User {
  username: string;
}

export interface Room {
  name: string;
}

interface NetworkValues {
  users: User[];
  rooms: Room[];
  currentUser: User | undefined;
  currentRoom: Room | undefined;
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
  sendMessage: () => void;
  setUsername: (username: string) => void;
  createRoom: (roomName: string) => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  currentUser: { username: "" },
  rooms: [],
  currentRoom: { name: "" },
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

  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on("user", (user: []) => {
      console.log("your userarray is: " + user);
    });
    socketRef.current.on("set rooms", (rooms: Room[]) => {
      setRooms(rooms);
    });
    socketRef.current.on("set users", (users: User[]) => {
      setUsers(users);
    });
  }, []);

  const connectToRoom = () => {};
  const disconnectFromRoom = () => {};
  const sendMessage = () => {};

  const setUsername = (username: string) => {
    if (socketRef.current) {
      socketRef.current.emit("new user", username);
    }

    setCurrentUser({ username: username });
  };

  const createRoom = (roomName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("create room", roomName);
    }
    setCurrentRoom({ name: roomName });
  };

  return (
    <NetworkContext.Provider
      value={{
        users,
        currentUser,
        rooms,
        currentRoom,
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
