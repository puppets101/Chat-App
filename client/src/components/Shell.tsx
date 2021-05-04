import React, { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
};

const Shell: React.FC<Props> = ({ children }) => {
  return (
    <div style={root}>
      <div style={sideContainer}>
        <h2>Rooms</h2>
      </div>
      <div style={centerContainer}>{children}</div>
      <div style={sideContainer}>
        <h2>Users</h2>
      </div>
    </div>
  );
};

const root: CSSProperties = {
  maxWidth: "1450px",
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "space-between",
};

const centerContainer: CSSProperties = {
  position: "relative",
  display: "flex",
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
};

const sideContainer: CSSProperties = {
  backgroundColor: "#f3f3f3",
  maxWidth: "300px",
  padding: "16px 32px",
};

export default Shell;
