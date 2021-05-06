import React, { ChangeEvent, CSSProperties, useContext, useState } from "react";
import Header from "./Header";
import PageHeading from "./PageHeading";
import { buttonStyle, inputStyle } from "../styles";
import { NetworkContext } from "../context/NetworkContext";
import { useHistory } from "react-router";

function Start() {
  const history = useHistory();

  const networkContext = useContext(NetworkContext);

  const [inputUsername, setInputUsername] = useState("");

  const handleUsernameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const handleGoToLobbyClick = () => {
    networkContext.setUsername(inputUsername);
    history.push("/lobby");
  };

  return (
    <div style={root}>
      <Header title="Welcome to Chut App" />
      <PageHeading title="Choose a username" />
      <div style={inputContainer}>
        <label style={label} htmlFor="username">
          Username
        </label>
        <input
          style={inputStyle}
          type="text"
          name="username"
          onChange={handleUsernameInput}
        />
        <button style={buttonStyle} onClick={handleGoToLobbyClick}>
          Go to Lobby
        </button>
      </div>
    </div>
  );
}

const root: CSSProperties = {};
const inputContainer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const label: CSSProperties = {
  fontSize: "0.8rem",
};

export default Start;
