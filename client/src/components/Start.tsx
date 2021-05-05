import React, { CSSProperties, useContext } from "react";
import Header from "./Header";
import PageHeading from "./PageHeading";
import { buttonStyle, inputStyle } from "../styles";
import { NetworkContext } from "../context/NetworkContext";

function Start() {
  const networkContext = useContext(NetworkContext);
  console.log(networkContext);

  return (
    <div style={root}>
      <Header title="Welcome to Chut App" />
      <PageHeading title="Choose a username" />
      <div style={inputContainer}>
        <label style={label} htmlFor="username">
          Username
        </label>
        <input style={inputStyle} type="text" name="username" />
        <button style={buttonStyle}>Go to Lobby</button>
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
