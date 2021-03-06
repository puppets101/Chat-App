import React, {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
import Header from "./Header";
import PageHeading from "./PageHeading";
import { buttonStyle, inputStyle, labelStyle } from "../styles";
import { NetworkContext } from "../context/NetworkContext";
import { useHistory } from "react-router";

function Start() {
  const history = useHistory();

  const networkContext = useContext(NetworkContext);

  const [inputUsername, setInputUsername] = useState("");

  const handleUsernameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInputUsername(e.target.value);
  };

  const handleEnterClick = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      networkContext.setUsername(inputUsername);
      history.push("/lobby");
    }
  };

  const handleGoToLobbyClick = () => {
    networkContext.setUsername(inputUsername);
    history.push("/lobby");
  };

  return (
    <div style={root}>
      <Header title="Welcome to Chut App" />
      <div style={container}>
        <PageHeading title="Choose a username" />
        <div style={inputContainer}>
          <label style={labelStyle} htmlFor="username">
            Username
          </label>
          <input
            autoFocus
            onKeyUp={handleEnterClick}
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
    </div>
  );
}

const root: CSSProperties = {};

const container: CSSProperties = {
  marginTop: "4rem",
  display: "flex",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const inputContainer: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  maxWidth: "600px",
};

const label: CSSProperties = {
  fontSize: "0.8rem",
};

export default Start;
