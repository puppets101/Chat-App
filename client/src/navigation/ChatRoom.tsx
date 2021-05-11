import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import PageHeading from "../components/PageHeading";
import Header from "../components/Header";
import { NetworkContext, Room } from "../context/NetworkContext";
import ChatFeed from "../components/ChatFeed";

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
    network.disconnectFromRoom();
    history.push("/lobby");
  };

  if (network.currentUser.username === "") {
    history.push("/");
    return null;
  }

  return (
    <div style={root}>
      <Header
        title={`${room?.name}`}
        loggedIn={true}
        loggedInText={`Welcome ${network.currentUser?.username}`}
      />
      <ChatFeed />
      <button onClick={handleLeaveClick}>leave room</button>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
  height: "100%",
};

export default ChatRoom;
