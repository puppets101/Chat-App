import React, { CSSProperties, useContext } from "react";
import { useHistory } from "react-router";
import { NetworkContext } from "../context/NetworkContext";

interface Props {
  name: string;
}

function Room(props: Props) {
  const network = useContext(NetworkContext);
  const history = useHistory();

  const handleJoinRoomClick = (name: string) => {
    network.joinRoom(name);
    history.push(`/chat-room/${name}`);
  };

  return (
    <div style={root}>
      <h4>{props.name}</h4>
      <button onClick={() => handleJoinRoomClick(props.name)}>
        Go to Room
      </button>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
};

export default Room;
