import React, { CSSProperties } from "react";

interface Props {
  name: string;
}

function RoomItem(props: Props) {
  return (
    <div style={root}>
      <span>{props.name}</span>
      <button>Join</button>
    </div>
  );
}

const root: CSSProperties = {
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
};

export default RoomItem;
