import React, { CSSProperties, useContext } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";
import RoomListItem from "../components/RoomListItem";
import { NetworkContext } from "../context/NetworkContext";
import {
  buttonStyle,
  flexColCenter,
  flexColStart,
  marginL,
  marginM,
} from "../styles";

function Lobby() {
  const history = useHistory();
  const network = useContext(NetworkContext);

  const handleCreateRoomClick = () => {
    history.push("/create-room");
  };

  const { rooms, currentUser } = network;

  if (currentUser.username === "") {
    history.push("/");
    return null;
  }

  return (
    <div style={root}>
      <Header
        title="Lobby"
        loggedIn={true}
        loggedInText={`Welcome ${network.currentUser?.username}`}
      />
      <div style={{ ...flexColCenter, ...marginL }}>
        <PageHeading title="Join a room" />
        <div style={{ ...roomWrapper, ...flexColStart }}>
          {/* {rooms.length ? (
            rooms.map((room) => <RoomListItem room={room} />)
          ) : (
            <span style={{ textAlign: "center" }}>No rooms created yet.</span>
          )} */}
        </div>
        <div style={{ ...flexColCenter, ...marginM }}>
          {rooms.length ? <p>Or</p> : <p>Go ahead and</p>}
          <button style={buttonStyle} onClick={handleCreateRoomClick}>
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
};

const roomWrapper: CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  backgroundColor: "#dddddd",
  borderRadius: "1rem",
  padding: "2rem",
};

export default Lobby;
