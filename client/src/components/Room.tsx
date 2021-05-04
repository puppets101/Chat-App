import React, { CSSProperties } from "react";

interface Props {
  name: string;
  path?: string;
}

function Room(props: Props) {
  return (
    <div style={root}>
      <h4>{props.name}</h4>
      <button>Go to Room</button>
    </div>
  );
}

const root: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
};

export default Room;
