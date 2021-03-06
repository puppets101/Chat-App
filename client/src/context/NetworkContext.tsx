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
  updateRooms: (roomName: string) => void;
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
  updateRooms: () => {},
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

  useEffect(() => {
    // n??r rooms uppdateras m??ste vi kontrollera om current room har ??ndrats
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

  const removeMember = (user: User, roomName: string) => {
    // Find room to update
    const roomToUpdate = rooms.find((room) => room.name === roomName);
    console.log(roomToUpdate);
    if (!roomToUpdate) return;
    // Find user to remove
    const userIndex = rooms[rooms.indexOf(roomToUpdate)].members.findIndex(
      (u) => u.username === user.username
    );
    const roomsCopy = rooms;
    roomsCopy[roomsCopy.indexOf(roomToUpdate)].members.splice(userIndex, 1);
    console.log(roomsCopy);
    setRooms(roomsCopy);
  };

  const updateRooms = (roomName: string) => {
    removeMember(currentUser, roomName);
    const roomToRemove = rooms.find((room) => room.name === roomName);
    console.log(roomToRemove);
    if (!roomToRemove) return;
    if (roomToRemove.members.length < 1) {
      const updatedRooms = rooms.filter(
        (room) => room.name !== roomToRemove?.name
      );
      setRooms(updatedRooms);
    }
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
        updateRooms,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
