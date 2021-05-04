import express from "express";
import http from "http";
const app = express();
const PORT = 4000;

const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server);

app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log("Client was connected. ID: " + socket.id);

  // SEND TO ALL
  io.emit("user-connected", socket.id);

  // SEND TO ALL BUT SELF
  socket.broadcast.emit("user-connected", socket.id);

  // SEND ONLY TO SOCKET
  socket.emit("user-return-msg", "Welcome user!");
});

app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
