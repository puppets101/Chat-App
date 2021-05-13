import { createContext, useEffect, useRef, useState } from "react";
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
  passwordValidation: "correct" | "waiting" | "wrong";
  leaveRoom: () => void;
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
  passwordValidation: "waiting",
  leaveRoom: () => {},
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

  const [passwordValidation, setPasswordValidation] =
    useState<"correct" | "waiting" | "wrong">("waiting");

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
      if (isValidated) {
        setPasswordValidation("correct");
      } else {
        setPasswordValidation("wrong");
      }
    });
  }, []);

  console.log("Passsword validated:" + passwordValidation);

  useEffect(() => {
    // när rooms uppdateras måste vi kontrollera om current room har ändrats
    const updatedRoom = rooms.find((room) => room.name === currentRoom?.name);
    setCurrentRoom(updatedRoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms]);

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

  const leaveRoom = () => {
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

  console.log(currentRoom?.members);

  const joinRoom = (roomName: string, password?: string) => {
    if (currentRoom) {
      leaveRoom();
    }
    if (socketRef.current) {
      const username = currentUser.username;
      if (password) {
        socketRef.current.emit("join room", { roomName, username, password });
      } else {
        socketRef.current.emit("join room", { roomName, username });
      }
    }
    // Make sure to reset password validation after user has joined a room
    setPasswordValidation("waiting");
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
        passwordValidation: passwordValidation,
        leaveRoom,
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
