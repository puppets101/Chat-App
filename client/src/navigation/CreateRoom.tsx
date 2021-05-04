import React, { CSSProperties } from "react";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";

interface Props {
  title: string;
  loggedIn?: boolean;
  loggedInText?: string;
}

function CreateRoom() {
  return (
    <div style={root}>
      <Header title="Lobby" />
      <PageHeading title="Create new room" />
      <div style={input}>
        <label htmlFor="name">Room name</label>
        <input type="text" name="name" />
        <label htmlFor="password">Password (optional)</label>
        <input type="text" name="password" />
        <button>Create Room</button>
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
