import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import Router from "./navigation/Router";

function App() {
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", (data: string) => {
      console.log(data);
    });

    socketRef.current.on("test", (id: string) => {
      console.log("Your ID is: " + id);
    });
  }, []);

  return <Router />;
}

export default App;
