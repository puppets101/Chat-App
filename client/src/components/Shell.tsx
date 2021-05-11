import React, { CSSProperties, useContext } from "react";
import { NetworkContext } from "../context/NetworkContext";
import RoomItem from "./RoomItem";
import UserItem from "./UserItem";

type Props = {
  children: React.ReactNode;
};

const Shell: React.FC<Props> = ({ children }) => {
  const network = useContext(NetworkContext);
  const { rooms, currentRoom } = network;

  return (
    <div style={root}>
      <div style={sideContainer}>
        <h2 style={sideHeading}>Rooms</h2>
        <div>
          {rooms.length ? (
            rooms.map(({ name, members }) => <RoomItem name={name} />)
          ) : (
            <span>No rooms to join</span>
          )}
        </div>
      </div>
      <div style={centerContainer}>{children}</div>
      <div style={sideContainer}>
        <h2 style={sideHeading}>Users in this room</h2>
        <div>
          {currentRoom?.members.length
            ? currentRoom.members.map(({ username }) => (
                <UserItem name={username} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

const root: CSSProperties = {
  maxWidth: "1450px",
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "space-between",
  margin: "auto",
};

const sideHeading: CSSProperties = {
  marginBottom: "4rem",
  textAlign: "center",
};

const centerContainer: CSSProperties = {
  height: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  flex: 1,
};

const sideContainer: CSSProperties = {
  backgroundColor: "#f3f3f3",
  width: "200px",
  padding: "1rem",
  borderColor: "black",
  borderWidth: "0 2px 0 2px",
  borderStyle: "solid",
};

export default Shell;
