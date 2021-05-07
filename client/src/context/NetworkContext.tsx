import { createContext, useEffect, useRef, useState } from "react";
import SocketIO from "socket.io";
import io from "socket.io-client";

type Props = {
  children: React.ReactNode;
};

export interface User {
  id: string;
  name: string;
}

export interface Room {
  name: string;
  members: User[];
  messages: string[];
}

export interface Message {
  author: User;
  body: string;
}

interface NetworkValues {
  users: User[];
  rooms: Room[];
  currentUser: User | undefined;
  currentRoomName: string;
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
  sendMessage: () => void;
  setUsername: (username: string) => void;
  createRoom: (roomName: string) => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  currentUser: { name: "", id: "" },
  rooms: [],
  currentRoomName: "",
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
  const [currentRoomName, setCurrentRoom] = useState<string>("");
  const [messagesInRoom, setMessagesInRoom] = useState<string[]>([]);

  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on(
      "update data",
      (data: { rooms: Room[]; users: User[] }) => {
        setRooms(data.rooms);
        setUsers(data.users);
      }
    );
    socketRef.current.on("user", (user: []) => {
      console.log("your userarray is: " + user);
    });
    socketRef.current.on("set rooms", (rooms: Room[]) => {
      setRooms(rooms);
    });
    socketRef.current.on("set users", (users: User[]) => {
      setUsers(users);
    });
    socketRef.current.on("post message", (message: string) => {
      setMessagesInRoom([...messagesInRoom, message]);
    });
    socketRef.current.on("joined room", (message: string) => {
      console.log(message);
    });
  }, []);

  console.log(rooms);

  const connectToRoom = () => {};
  const disconnectFromRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave room");
      setCurrentRoom("");
    }
  };

  const sendMessage = () => {};

  const setUsername = (username: string) => {
    if (socketRef.current) {
      socketRef.current.emit("new user", username);
      setCurrentUser({ name: username, id: socketRef.current.id });
    }
  };

  const createRoom = (roomName: string) => {
    if (socketRef.current) {
      socketRef.current.emit("create room", { roomName, currentUser });
    }
    setCurrentRoom(roomName);
  };

  console.log(users);

  return (
    <NetworkContext.Provider
      value={{
        users,
        currentUser,
        rooms,
        currentRoomName,
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
