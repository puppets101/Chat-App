import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import PageHeading from "../components/PageHeading";
import Header from "../components/Header";
import { NetworkContext, Room } from "../context/NetworkContext";
import ChatFeed from "../components/ChatFeed";

interface Params {
  name: string;
}

function ChatRoom() {
  const match = useRouteMatch<Params>();
  const network = useContext(NetworkContext);
  const room: Room | undefined = network.rooms.find(
    (room) => room.name === match.params.name
  );

  const handleLeaveClick = () => {
    network.disconnectFromRoom();
  };

  return (
    <div style={root}>
      <Header
        title={`${room?.name}`}
        loggedIn={true}
        loggedInText={`Welcome ${network.currentUser?.name}`}
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
