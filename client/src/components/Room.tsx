import React, { CSSProperties, useContext } from "react";
import { useHistory } from "react-router";
import { NetworkContext, User } from "../context/NetworkContext";

interface Props {
  name: string;
  members: User[];
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
      <div>
        <div style={flex}>
          <h4>{props.name}</h4>
          <div>
            <button onClick={() => handleJoinRoomClick(props.name)}>
              Go to Room
            </button>
          </div>
        </div>
        <ul>
          {props.members.map(({ username }) => (
            <li>{username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
};
const flex: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

export default Room;
