import express from "express";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = 4000;

const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server);

app.use(
  createProxyMiddleware("/websocket", {
    target: "http://localhost:4000",
    ws: true,
  })
);
app.use(express.static("client"));

io.on("connection", (socket) => {
  console.log("Client was connected");
});

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
