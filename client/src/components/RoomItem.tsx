import React, { CSSProperties, useContext } from "react";
import { useHistory } from "react-router";
import { NetworkContext } from "../context/NetworkContext";

interface Props {
  name: string;
}

function RoomItem(props: Props) {
  const network = useContext(NetworkContext);
  const history = useHistory();

  const handleJoinRoomClick = (name: string) => {
    network.joinRoom(name);
    history.push(`/chat-room/${name}`);
  };

  return (
    <div style={root}>
      <span>{props.name}</span>
      <button onClick={() => handleJoinRoomClick(props.name)}>Join</button>
    </div>
  );
}

const root: CSSProperties = {
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
};

export default RoomItem;
