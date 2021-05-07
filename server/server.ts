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

interface User {
  id: string;
  name: string;
}

interface Message {
  author: User;
  body: string;
}

interface Room {
  name: string;
  members: User[];
  messages: Message[];
}

// DATA
const users: User[] = [];
const rooms: Room[] = [];

app.use(express.static("client"));

io.on("connection", (socket: SocketIO.Socket) => {
  // DISPLAY THAT CLIENT CONNECTED
  console.log("Client was connected with ID:", socket.id);

  socket.on("new user", (username) => {
    newUser(socket, username);
  });

  socket.on("create room", (data: { roomName: string; user: User }) => {
    // Update rooms array with new room
    addNewRoom(socket, data.roomName);

    socket.join(data.roomName, () => {
      console.log("we have joined");
      socket.removeAllListeners("message");

      socket
        .to(data.roomName)
        .emit("joined room", `${data.user.name} has joined the room!`);
    });
  });

  // socket.on("join room", (data) => {
  //   socket.join(data.room, () => {
  //     // ***** TODO: MAKE SURE TO UPDATE ROOMS ARRAY

  //     socket.removeAllListeners("message");

  //     // SEND MESSAGE TO ALL CLIENTS IN ROOM
  //     io.to(data.room).emit("joined room", `${data.name} has joined the room!`);

  //     socket.on("message", (message) => {
  //       // ***** TODO: MAKE SURE TO UPDATE MESSAGES IN ROOM ARRAY
  //       // updateMessagesInRoom(data.room, message);
  //       io.to(data.room).emit("send message", message);
  //     });

  //     // BROADCAST ALL ROOMS TO ALL CLIENTS
  //     io.emit("update rooms", updateRooms());
  //   });

  //   // ALWAYS UPDATES ROOMS WHEN CLIENT HAS CONNECTED
  //   io.emit("update data", emitData());
  // });

  // SEND SOME INFO AND UPDATE ROOMS WHEN CLIENT HAS DISCONNECTED
  socket.on("disconnect", (reason) => {
    // ***** TODO: MAKE SURE TO UPDATE ROOMS AND USERS ARRAY
    console.log(`ID: ${socket.id} has disconnected. Reason: ${reason}`);
    disconnectUser(socket);
  });
});

function newUser(socket: SocketIO.Socket, username: string) {
  const newUser: User = {
    name: username,
    id: socket.id,
  };
  users.push(newUser);
  emitData();
}

function disconnectUser(socket: SocketIO.Socket) {
  // FIND CLIENT IN USER ARRAY AND REMOVE
  const index = users.findIndex((user) => {
    user.id === socket.id;
  });
  users.splice(index, 1);
  emitData();
}

function updateMessagesInRoom() {
  // UPDATE MESSAGES WHEN SENT TO ROOM
}

function addNewRoom(socket: SocketIO.Socket, roomName: string) {
  const newRoom: Room = {
    name: roomName,
    members: [getUser(socket.id)],
    messages: [],
  };
  rooms.push(newRoom);
  emitData();
}

function getUser(id: string): User {
  const user: User = users.find((user) => user.id === id);
  return user;
}

function emitData() {
  // SEND NEW DATA TO CLIENT
  io.emit("update data", { rooms, users });
}

// io.on("connection", (socket) => {
//   console.log("Client was connected", socket.id);

//   socket.on("new user", (username) => {
//     socket.username = username;
//     users.push(socket.username);
//     console.log("user array on server: " + users);
//   });

//   socket.on("create room", (roomName) => {
//     socket.join(roomName);
//     rooms.push({ name: roomName });
//     socket.emit("set rooms", rooms);
//   });

//   socket.on("message", (message) => {
//     io.to(socket.rooms).emit("post message", message);
//   });

//   socket.emit("set users", users);
// });

// io.on("connection", onConnection);

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
