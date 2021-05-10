import React, { CSSProperties } from "react";

interface Props {
  name: string;
}

function UserItem(props: Props) {
  return (
    <div style={root}>
      <span>{props.name}</span>
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
