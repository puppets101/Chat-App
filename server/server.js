const express = require("express");
const http = require("http");

const app = express();
const PORT = 4000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"],
  },
});

const users = [];
const rooms = [];

app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log("Client was connected", socket.id);

  socket.emit("users", users);

  socket.on("username", (username) => {
    socket.username = username;
    users.push(socket.username);
    console.log("user array on server: " + users);
  });
  socket.on("create", (roomName) => {
    socket.join(roomName);
    rooms.push(roomName);
    console.log(socket.rooms);
  });
});

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
