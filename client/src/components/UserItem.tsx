import React, { CSSProperties } from "react";

interface Props {
  name: string;
  currentRoom: string;
}

function UserItem(props: Props) {
  return (
    <div style={root}>
      <span>{props.name}</span>
      <span style={currentRoom}>{props.currentRoom}</span>
    </div>
  );
}

const root: CSSProperties = {
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const currentRoom: CSSProperties = {
  fontSize: "0.8rem",
};

export default UserItem;
