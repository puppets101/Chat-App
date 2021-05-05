import React, { CSSProperties } from "react";

interface Props {
  title: string;
  loggedIn?: boolean;
  loggedInText?: string;
}

function Header(props: Props) {
  return (
    <div style={root}>
      <h2 style={title}>{props.title}</h2>
      {props.loggedIn ? <h2>{props.loggedInText}</h2> : null}
    </div>
  );
}

const root: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 64px",
  borderBottom: "2px solid black",
  backgroundColor: "#f3f3f3",
};

const title: CSSProperties = {
  textAlign: "center",
};

export default Header;
