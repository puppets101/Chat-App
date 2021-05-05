import { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

interface User {
  username: string;
}

interface Room {
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

const NetworkContext = createContext<NetworkValues>({
  users: [],
  rooms: [],
  connectToRoom: () => {},
  disconnectFromRoom: () => {},
  sendMessage: () => {},
});

const NetworkProvider: React.FC<Props> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

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
