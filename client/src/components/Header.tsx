import React, { CSSProperties } from "react";

interface Props {
  title: string;
  loggedIn?: boolean;
  loggedInText?: string;
}

function Header(props: Props) {
  return (
    <div style={root}>
      <h2>{props.title}</h2>
    </div>
  );
}

const root: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  display: "flex",
  padding: "16px 64px",
  borderBottom: "2px solid black",
};

export default Header;
