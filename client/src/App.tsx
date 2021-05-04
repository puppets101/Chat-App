import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const socketRef = useRef();

  useEffect(() => {
    const socket = io("/");

    socket.on("connect", () => {
      console.log("user is connected");
    });

    socket.on("user-connected", (data) => {
      console.log(`User with ID '${data}' has connected`);
    });
  }, []);

  return <h1>Hello</h1>;
}

export default App;
