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
  username: string;
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
    newUserData(socket, username);
  });

  socket.on("create room", (data: { roomName: string; username: string }) => {
    // Update rooms array with new room
    addNewRoom(socket, data.roomName);

    socket.join(data.roomName);
    console.log(socket.rooms);

    console.log("we have joined");
    socket.removeAllListeners("message");

    io.to(data.roomName).emit(
      "joined room",
      `${data.username} has joined the room!`
    );

    socket.on("new message", (message: string) => {
      const newMessage = {
        author: getUser(socket.id),
        body: message,
      };
      console.log(newMessage.author);

      io.to(data.roomName).emit("set message", newMessage);
    });

    socket.on("leave room", () => {
      removeMemberData(socket, data.roomName);
      updateRoomsData(data.roomName);
      socket.leave(data.roomName);
    });

    socket.on("disconnect", (reason) => {
      // ***** TODO: MAKE SURE TO UPDATE ROOMS AND USERS ARRAY
      console.log(`ID: ${socket.id} has disconnected. Reason: ${reason}`);
      removeUserData(socket);
      removeMemberData(socket, data.roomName);
      updateRoomsData(data.roomName);
    });
  });

  // SEND SOME INFO AND UPDATE ROOMS WHEN CLIENT HAS DISCONNECTED
  socket.on("disconnect", (reason) => {
    // ***** TODO: MAKE SURE TO UPDATE ROOMS AND USERS ARRAY
    console.log(`ID: ${socket.id} has disconnected. Reason: ${reason}`);
    removeUserData(socket);
  });
});

function newUserData(socket: SocketIO.Socket, username: string) {
  const newUser: User = {
    username: username,
    id: socket.id,
  };
  users.push(newUser);
  emitData();
}

function removeUserData(socket: SocketIO.Socket) {
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

function addMemberData(socket: SocketIO.Socket, roomName: string) {
  const newMember = getUser(socket.id);
  const roomToPopulate = getRoom(roomName);
  rooms[rooms.indexOf(roomToPopulate)].members.push(newMember);
  console.log("rooms array: " + rooms);
  emitData();
}

function removeMemberData(socket: SocketIO.Socket, roomName: string) {
  const memberToRemove = getUser(socket.id);
  const roomToUpdate = getRoom(roomName);
  const index = roomToUpdate.members.findIndex(
    (member) => member.id === memberToRemove.id
  );
  rooms[rooms.indexOf(roomToUpdate)].members.splice(index, 1);
  emitData();
}

function updateRoomsData(roomName: string) {
  const index = rooms.findIndex((room) => room.name === roomName);
  if (rooms[index].members.length < 1) {
    rooms.splice(index, 1);
  }
  console.log(rooms);
  emitData();
}

function getUser(id: string): User {
  return users.find((user) => user.id === id);
}

function getRoom(name: string): Room {
  return rooms.find((room) => room.name === name);
}

function emitData() {
  // SEND NEW DATA TO CLIENT
  io.emit("update data", { rooms, users });
}

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
