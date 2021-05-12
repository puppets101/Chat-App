import React, { CSSProperties, useContext } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";
import RoomListItem from "../components/RoomListItem";
import { NetworkContext } from "../context/NetworkContext";

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
      <div style={container}>
        <PageHeading title="Join a room" />
        <div style={roomWrapper}>
          {rooms.length ? (
            rooms.map((room) => <RoomListItem room={room} />)
          ) : (
            <span>No rooms created yet.</span>
          )}
        </div>
        <div>
          {rooms.length ? <p>Or</p> : <p>Go ahead and</p>}
          <button onClick={handleCreateRoomClick}>Create Room</button>
        </div>
      </div>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
};

const container: CSSProperties = {
  padding: "4rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const roomWrapper: CSSProperties = {
  maxWidth: "600px",
};

export default Lobby;
