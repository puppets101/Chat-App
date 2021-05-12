import React, {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";
import { NetworkContext } from "../context/NetworkContext";
import {
  buttonStyle,
  flexColCenter,
  inputStyle,
  labelStyle,
  marginL,
} from "../styles";

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

  const handleEnterClick = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCreateRoomClick();
    }
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
      <div style={{ ...inputWrapper, ...flexColCenter, ...marginL }}>
        <label style={labelStyle} htmlFor="name">
          Room name
        </label>
        <input
          onKeyUp={handleEnterClick}
          autoFocus
          style={inputStyle}
          onChange={handleCreateRoomInput}
          type="text"
          name="name"
        />
        <label style={labelStyle} htmlFor="password">
          Password (optional)
        </label>
        <input
          style={inputStyle}
          onChange={handlePasswordInput}
          type="text"
          name="password"
          onKeyUp={handleEnterClick}
        />
        <button style={buttonStyle} onClick={handleCreateRoomClick}>
          Create Room
        </button>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
};
const inputWrapper: CSSProperties = {};

export default CreateRoom;
