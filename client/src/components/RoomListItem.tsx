import React, {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
import { useHistory } from "react-router";
import { NetworkContext, Room } from "../context/NetworkContext";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { buttonStyle, flexColStart, inputStyle, labelStyle } from "../styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  room: Room;
}

library.add(fab, faLock);

function RoomListItem(props: Props) {
  const network = useContext(NetworkContext);
  const history = useHistory();
  const [password, setPassword] = useState("");

  const handleEnterClick = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleJoinRoomClick(props.room.name);
    }
  };

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
        <div style={flexColStart}>
          <h3 style={{ marginRight: "2rem" }}>
            {" "}
            {props.room.name}{" "}
            {props.room.password ? (
              <FontAwesomeIcon icon={["fas", "lock"]} />
            ) : (
              ""
            )}
          </h3>
          <div style={{ ...flexColStart, marginBottom: "1rem" }}>
            {props.room.members.map(({ username }, index) => (
              <span key={username + index}>- {username}</span>
            ))}
          </div>
          <div style={flexColStart}>
            {props.room.password ? (
              <div style={flexColStart}>
                <label style={labelStyle} htmlFor="password">
                  Password
                </label>
                <input
                  onKeyUp={handleEnterClick}
                  style={inputStyle}
                  onChange={handlePasswordInput}
                  type="password"
                  name="password"
                />
              </div>
            ) : null}
            {network.passwordValidation === "wrong" ? (
              <span style={{ color: "red", marginBottom: "1rem" }}>
                Wrong password!
              </span>
            ) : null}
            <div>
              <button
                style={buttonStyle}
                onClick={() => handleJoinRoomClick(props.room.name)}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div style={divider}></div>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
};

const divider: CSSProperties = {
  height: "2px",
  width: "100%",
  backgroundColor: "#dddddd",
  margin: "1rem 0",
};

export default RoomListItem;
