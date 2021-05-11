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
  userIsTyping: boolean;
  whoIsTyping: string;
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
  sendMessage: (message: string) => void;
  setUsername: (username: string) => void;
  joinRoom: (roomName: string) => void;
  handleUserIsTyping: (userIsTyping: boolean) => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  currentUser: { username: "", id: "" },
  rooms: [],
  currentRoom: { name: "", members: [], messages: [] },
  messagesInRoom: [],
  userIsTyping: false,
  whoIsTyping: "",
  connectToRoom: () => {},
  disconnectFromRoom: () => {},
  sendMessage: () => {},
  setUsername: () => {},
  joinRoom: () => {},
  handleUserIsTyping: () => {},
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

  const [userIsTyping, setUserIsTyping] = useState(false);
  const [whoIsTyping, setWhoIsTyping] = useState("");

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
    socketRef.current.on("broadcast typing", (body: string) => {
      setWhoIsTyping(body);
    });
    socketRef.current.on("set message", (message: Message) => {
      setMessagesInRoom((prev) => [...prev, message]);
    });
    socketRef.current.on("set current room", (room: Room) => {
      setCurrentRoom(room);
    });
  }, []);

  useEffect(() => {
    if (currentRoom) {
      setMessagesInRoom(currentRoom.messages);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("user is typing", userIsTyping);
    }
  }, [userIsTyping]);

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

  const handleUserIsTyping = (isTyping: boolean) => {
    setUserIsTyping(isTyping);
    console.log(isTyping);
  };

  return (
    <NetworkContext.Provider
      value={{
        users,
        currentUser,
        rooms,
        currentRoom,
        messagesInRoom,
        userIsTyping,
        whoIsTyping,
        connectToRoom,
        disconnectFromRoom,
        sendMessage,
        setUsername,
        joinRoom,
        handleUserIsTyping,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
