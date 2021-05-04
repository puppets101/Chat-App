import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

function App() {
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    socketRef.current = io.connect("/");

    socketRef.current.on("connection", (data: string) => {
      console.log(data);
    });
  }, []);

  return <h1>Hello</h1>;
}

export default App;
