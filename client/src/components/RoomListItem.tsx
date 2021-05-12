import React, { ChangeEvent, CSSProperties, useContext, useState } from "react";
import { useHistory } from "react-router";
import { NetworkContext, Room, User } from "../context/NetworkContext";

interface Props {
  room: Room;
}

function RoomListItem(props: Props) {
  const network = useContext(NetworkContext);
  const history = useHistory();
  const [password, setPassword] = useState("");

  const handleJoinRoomClick = (name: string) => {
    if (password) {
      network.joinRoom(name, password);
    } else {
      network.joinRoom(name);
    }
  };

  // As soon as password validation is OK - push to room URL
  if (network.passwordValidation === "correct") {
    history.push(`/chat-room/${props.room.name}`);
  }

  const handlePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div style={root}>
      <div>
        <div style={flex}>
          <h4>{props.room.name}</h4>
          <div style={flexRow}>
            {props.room.password ? (
              <div>
                <label htmlFor="password">Password</label>
                <input
                  onChange={handlePasswordInput}
                  type="password"
                  name="password"
                />
              </div>
            ) : null}
            {network.passwordValidation === "wrong" ? (
              <span>Wrong password</span>
            ) : null}
            <div>
              <button onClick={() => handleJoinRoomClick(props.room.name)}>
                Join
              </button>
            </div>
          </div>
        </div>
        <ul>
          {props.room.members.map(({ username }) => (
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
  flexDirection: "column",
};
const flexRow: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
};

export default RoomListItem;
