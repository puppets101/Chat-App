import React, { CSSProperties, useContext } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";
import Room from "../components/Room";
import { NetworkContext } from "../context/NetworkContext";

function Lobby() {
  const history = useHistory();
  const network = useContext(NetworkContext);

  const handleCreateRoomClick = () => {
    history.push("/create-room");
  };

  const { rooms } = network;

  return (
    <div style={root}>
      <Header
        title="Lobby"
        loggedIn={true}
        loggedInText={`Welcome ${network.currentUser?.username}`}
      />
      <PageHeading title="Join a room" />
      <div style={roomWrapper}>
        {rooms.length ? (
          rooms.map(({ name }) => <Room name={name} />)
        ) : (
          <span>No rooms created yet.</span>
        )}
      </div>
      <div>
        {rooms.length ? <p>Or</p> : <p>Go ahead and</p>}
        <button onClick={handleCreateRoomClick}>Create Room</button>
      </div>
    </div>
  );
}

const root: CSSProperties = {};

const roomWrapper: CSSProperties = {
  maxWidth: "600px",
};

export default Lobby;
