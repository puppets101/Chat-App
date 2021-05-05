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

app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log("Client was connected");
  socket.emit("test", socket.id);
});

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
