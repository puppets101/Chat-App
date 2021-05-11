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
  password?: string;
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
  passwordIsValidated: boolean;
  connectToRoom: () => void;
  disconnectFromRoom: () => void;
  sendMessage: (message: string) => void;
  setUsername: (username: string) => void;
  joinRoom: (roomName: string, password?: string) => void;
  handleUserIsTyping: (userIsTyping: boolean) => void;
}

export const NetworkContext = createContext<NetworkValues>({
  users: [],
  currentUser: { username: "", id: "" },
  rooms: [],
  currentRoom: { name: "", members: [], messages: [], password: "" },
  messagesInRoom: [],
  userIsTyping: false,
  whoIsTyping: "",
  passwordIsValidated: true,
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

  const [passwordIsValidated, setPasswordIsValidated] = useState(true);

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
    socketRef.current.on("password validated", (isValidated: boolean) => {
      setPasswordIsValidated(isValidated);
    });
  }, []);

  console.log(passwordIsValidated);

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

  const joinRoom = (roomName: string, password?: string) => {
    // Ta emot password om det finns
    if (currentRoom) {
      disconnectFromRoom();
    }
    // Om password finns - skicka med det i emit join room

    if (socketRef.current) {
      const username = currentUser.username;
      if (password) {
        socketRef.current.emit("join room", { roomName, username, password });
      } else {
        socketRef.current.emit("join room", { roomName, username });
      }
      // Om lösenord fanns, så har vi via servern uppdaterat ett state som displayar för användaren om lösenored stämmer eller ej
    }
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
        passwordIsValidated,
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
