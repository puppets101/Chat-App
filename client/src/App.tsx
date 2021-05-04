import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Router from "./navigation/Router";

function App() {
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io.connect("/");

    socketRef.current.on("connection", (data: string) => {
      console.log(data);
    });
  }, []);

  return <Router />;
}

export default App;
