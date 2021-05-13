import React, { CSSProperties, useContext } from "react";
import { useHistory, useRouteMatch } from "react-router";

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
    if (room) {
      network.updateRooms(room.name);
      network.leaveRoom();
      history.push("/lobby");
    }
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
        loggedInText={`Logged in as ${network.currentUser?.username}`}
      />
      <ChatFeed />
      <button
        onClick={handleLeaveClick}
        style={{ ...buttonStyle, ...leaveRoom }}
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
