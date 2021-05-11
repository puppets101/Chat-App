import { createContext, useEffect, useRef, useState } from "react";
import SocketIO from "socket.io";
import io from "socket.io-client";

type Props = {
  children: React.ReactNode;
};

export interface User {
  id: string;
  username: string;
}

export interface Room {
  name: string;
  members: User[];
  messages: Message[];
}

export interface Message {
  author: User;
  body: string;
}

interface NetworkValues {
  users: User[];
  rooms: Room[];
  currentUser: User;
  currentRoom: Room | undefined;
  messagesInRoom: Message[];
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
  sendMessage: (message: string) => void;
  setUsername: (username: string) => void;
  joinRoom: (roomName: string) => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  currentUser: { username: "", id: "" },
  rooms: [],
  currentRoom: { name: "", members: [], messages: [] },
  messagesInRoom: [],
  connectToRoom: () => {},
  disconnectFromRoom: () => {},
  sendMessage: () => {},
  setUsername: () => {},
  joinRoom: () => {},
});

const NetworkProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({
    username: "",
    id: "",
  });

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | undefined>(undefined);
  const [messagesInRoom, setMessagesInRoom] = useState<Message[]>([]);

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
    socketRef.current.on("set rooms", (rooms: Room[]) => {
      setRooms(rooms);
    });
    socketRef.current.on("set users", (users: User[]) => {
      setUsers(users);
    });
    socketRef.current.on("joined room", (message: string) => {
      console.log(message);
    });
    socketRef.current.on("set message", (message: Message) => {
      setMessagesInRoom((prev) => [...prev, message]);
    });
  }, []);

  console.log(rooms);
  useEffect(() => {
    if (currentRoom) {
      setMessagesInRoom(currentRoom.messages);
    }
  }, [currentRoom]);

  const connectToRoom = () => {};

  const disconnectFromRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("leave room");
      setCurrentRoom(undefined);
      setMessagesInRoom([]);
    }
  };

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("new message", message);
    }
  };

  const setUsername = (username: string) => {
    if (socketRef.current) {
      socketRef.current.emit("new user", username);
      setCurrentUser({ username: username, id: socketRef.current.id });
    }
  };

  const joinRoom = (roomName: string) => {
    if (currentRoom) {
      disconnectFromRoom();
    }
    if (socketRef.current) {
      const username = currentUser.username;
      socketRef.current.emit("join room", { roomName, username });
    }
    const room = rooms.find((room) => room.name === roomName);
    console.log("found room:" + room);
    console.log("all rooms: " + rooms);
    setCurrentRoom(room);
  };

  return (
    <NetworkContext.Provider
      value={{
        users,
        currentUser,
        rooms,
        currentRoom,
        messagesInRoom,
        connectToRoom,
        disconnectFromRoom,
        sendMessage,
        setUsername,
        joinRoom,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
