import React, { CSSProperties } from "react";
import { useHistory } from "react-router";
import Header from "../components/Header";
import PageHeading from "../components/PageHeading";
import Room from "../components/Room";

function Lobby() {
  const history = useHistory();

  const handleCreateRoomClick = () => {
    history.push("/create-room");
  };

  return (
    <div style={root}>
      <Header title="Lobby" loggedIn={true} loggedInText="Welcome user" />
      <PageHeading title="Join a room" />
      <div style={roomWrapper}>
        <Room name="Room 1" />
        <Room name="Room 2" />
        <Room name="Room 3" />
      </div>
      <div>
        <p>Or</p>
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
