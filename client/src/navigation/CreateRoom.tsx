import React, { ChangeEvent, CSSProperties, useContext, useState } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";
import { NetworkContext } from "../context/NetworkContext";

interface Props {
  title: string;
  loggedIn?: boolean;
  loggedInText?: string;
}

function CreateRoom(props: Props) {
  const network = useContext(NetworkContext);
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleCreateRoomInput = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value);
  };

  const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleCreateRoomClick = () => {
    if (password) {
      network.joinRoom(roomName, password);
    } else {
      network.joinRoom(roomName);
    }
    history.push(`/chat-room/${roomName}`);
  };

  if (network.currentUser.username === "") {
    history.push("/");
    return null;
  }

  return (
    <div style={root}>
      <Header title="Lobby" />
      <PageHeading title="Create new room" />
      <div style={input}>
        <label htmlFor="name">Room name</label>
        <input onChange={handleCreateRoomInput} type="text" name="name" />
        <label htmlFor="password">Password (optional)</label>
        <input onChange={handlePasswordInput} type="text" name="password" />
        <button onClick={handleCreateRoomClick}>Create Room</button>
      </div>
    </div>
  );
}

const root: CSSProperties = {};
const input: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export default CreateRoom;
