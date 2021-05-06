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

// DATA
const users = [];
const rooms = [];

app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log("Client was connected", socket.id);

  socket.on("new user", (username) => {
    socket.username = username;
    users.push(socket.username);
    console.log("user array on server: " + users);
  });

  socket.on("create room", (roomName) => {
    socket.join(roomName);
    rooms.push({ name: roomName });
    socket.emit("set rooms", rooms);
  });

  socket.on("message", (message, room) => {
    io.to(room).emit("post message", message);
  });

  socket.emit("set users", users);
});

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
