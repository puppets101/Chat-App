import React, { CSSProperties, useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import PageHeading from "../components/PageHeading";
import Header from "../components/Header";
import { NetworkContext, Room } from "../context/NetworkContext";

interface Params {
  name: string;
}

function ChatRoom() {
  const match = useRouteMatch<Params>();
  const network = useContext(NetworkContext);
  console.log("Rooms: " + network.rooms);
  const room: Room | undefined = network.rooms.find(
    (room) => room.name === match.params.name
  );

  return (
    <div style={root}>
      <Header
        title={`${room?.name}`}
        loggedIn={true}
        loggedInText={`Welcome ${network.currentUser?.username}`}
      />
    </div>
  );
}

const root: CSSProperties = {};

export default ChatRoom;
