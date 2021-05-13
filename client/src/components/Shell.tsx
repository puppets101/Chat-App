import React, { CSSProperties, useContext } from "react";
import { NetworkContext } from "../context/NetworkContext";
import RoomListItem from "./RoomListItem";

type Props = {
  children: React.ReactNode;
};

const Shell: React.FC<Props> = ({ children }) => {
  const network = useContext(NetworkContext);
  const { rooms } = network;

  return (
    <div style={root}>
      <div style={sideContainer}>
        <h2 style={sideHeading}>Rooms</h2>
        <div>
          {rooms.length ? (
            rooms.map((room) => <RoomListItem key={room.name} room={room} />)
          ) : (
            <span>No rooms to join</span>
          )}
        </div>
      </div>
      <div style={centerContainer}>{children}</div>
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
  flex: 1,
  display: "flex",
  flexDirection: "column",
  borderRight: "2px solid black",
};

const sideContainer: CSSProperties = {
  backgroundColor: "#f3f3f3",
  width: "300px",
  padding: "1rem",
  borderColor: "black",
  borderWidth: "0 2px 0 2px",
  borderStyle: "solid",
};

export default Shell;
