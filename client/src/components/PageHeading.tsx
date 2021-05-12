import React, { CSSProperties } from "react";
import { marginL } from "../styles";

interface Props {
  title: string;
}

function PageHeading(props: Props) {
  return (
    <div style={{ ...marginL }}>
      <h2 style={heading}>{props.title}</h2>
    </div>
  );
}

const heading: CSSProperties = {
  fontSize: "2rem",
  textAlign: "center",
};

export default PageHeading;
