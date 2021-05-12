import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import PageHeading from "../components/PageHeading";
import Header from "../components/Header";
import { NetworkContext, Room } from "../context/NetworkContext";
import ChatFeed from "../components/ChatFeed";
import { buttonStyle } from "../styles";

interface Params {
  name: string;
}

function ChatRoom() {
  const match = useRouteMatch<Params>();
  const history = useHistory();
  const network = useContext(NetworkContext);
  const room: Room | undefined = network.rooms.find(
    (room) => room.name === match.params.name
  );

  const handleLeaveClick = () => {
    network.leaveRoom();
    history.push("/lobby");
  };

  if (network.currentUser.username === "") {
    history.push("/");
    return null;
  }

  // FULLÖSNING!!
  // if (!network.passwordIsValidated) {
  //   history.push("/lobby");
  // }

  return (
    <div style={root}>
      <Header
        title={`${room?.name}`}
        loggedIn={true}
        loggedInText={`Welcome ${network.currentUser?.username}`}
      />
      <ChatFeed />
      <button
        style={{ ...buttonStyle, ...leaveRoom }}
        onClick={handleLeaveClick}
      >
        Leave Room
      </button>
    </div>
  );
}

const root: CSSProperties = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const leaveRoom: CSSProperties = {
  backgroundColor: "#f73131",
  color: "black",
  borderRadius: 0,
  margin: 0,
  padding: "1rem",
};

export default ChatRoom;
