import React, { CSSProperties } from "react";
import Header from "./Header";
import PageHeading from "./PageHeading";

function Start() {
  return (
    <div style={root}>
      <Header title="Welcome to Chut App" />
      <PageHeading title="Choose a username" />
      <div style={input}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" />
        <button>Go to Lobby</button>
      </div>
    </div>
  );
}

const root: CSSProperties = {};
const input: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};
export default Start;
