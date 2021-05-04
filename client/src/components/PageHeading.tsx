import React, { CSSProperties } from "react";

interface Props {
  title: string;
}

function PageHeading(props: Props) {
  return (
    <div style={root}>
      <h2>{props.title}</h2>
    </div>
  );
}

const root: CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

export default PageHeading;
