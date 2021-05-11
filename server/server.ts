const express = require("express");
const http = require("http");

const app = express();
const PORT = 4000;

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
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
  password?: string;
}

// DATA
const users: User[] = [];
const rooms: Room[] = [];

io.on("connection", (socket: SocketIO.Socket) => {
  // DISPLAY THAT CLIENT CONNECTED
  console.log("Client was connected with ID:", socket.id);
  emitData();

  socket.on("new user", (username) => {
    newUserData(socket, username);
  });

  socket.on(
    "join room",
    (data: { roomName: string; username: string; password?: string }) => {
      socket.removeAllListeners("user is typing");
      socket.removeAllListeners("new message");
      socket.removeAllListeners("leave room");
      socket.removeAllListeners("disconnect");

      // Check if room already exists - if not, add the room to the rooms array
      if (rooms.findIndex((room) => room.name === data.roomName) === -1) {
        addNewRoom(socket, data.roomName, data.password);
      }

      if (data.password) {
        const room = getRoom(data.roomName);
        if (room.password !== data.password) {
          socket.emit("password validated", false);
          return;
        }
      }
      // We need to make sure to update the password validation state if no password on room
      socket.emit("password validated", true);

      socket.join(data.roomName);

      addMemberData(socket, data.roomName);
      console.log(rooms);

      socket.emit("set current room", getRoom(data.roomName));

      io.to(data.roomName).emit(
        "joined room",
        `${data.username} has joined the room!`
      );

      socket.on("user is typing", (isTyping: boolean) => {
        if (isTyping) {
          socket
            .to(data.roomName)
            .emit("broadcast typing", `${data.username} is typing...`);
        } else {
          socket.to(data.roomName).emit("broadcast typing", "");
        }
      });

      socket.on("new message", (message: string) => {
        const newMessage = {
          author: getUser(socket.id),
          body: message,
        };
        // Find room and add new message to messages array
        const roomToPopulate = getRoom(data.roomName);
        rooms[rooms.indexOf(roomToPopulate)].messages.push(newMessage);
        io.to(data.roomName).emit("set message", newMessage);
        emitData();
      });

      socket.on("leave room", () => {
        removeMemberData(socket, data.roomName);
        updateRoomsData(data.roomName);
        socket.leave(data.roomName);
      });

      socket.on("disconnect", (reason) => {
        // ***** TODO: MAKE SURE TO UPDATE ROOMS AND USERS ARRAY
        console.log(`ID: ${socket.id} has disconnected. Reason: ${reason}`);
        removeMemberData(socket, data.roomName);
        updateRoomsData(data.roomName);
        removeUserData(socket);
      });
      emitData();
    }
  );

  // SEND SOME INFO AND UPDATE ROOMS WHEN CLIENT HAS DISCONNECTED
  // socket.on("disconnecting", (reason) => {
  //   // ***** TODO: MAKE SURE TO UPDATE ROOMS AND USERS ARRAY
  //   console.log(`ID: ${socket.id} has disconnected. Reason: ${reason}`);

  // });
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
  const index = users.findIndex((user) => user.id === socket.id);
  users.splice(index, 1);
  emitData();
}

function updateMessagesInRoom() {
  // UPDATE MESSAGES WHEN SENT TO ROOM
}

function addNewRoom(
  socket: SocketIO.Socket,
  roomName: string,
  password?: string
) {
  const newRoom: Room = {
    name: roomName,
    members: [],
    messages: [],
    password: password,
  };
  rooms.push(newRoom);
  emitData();
}

function addMemberData(socket: SocketIO.Socket, roomName: string) {
  const newMember = getUser(socket.id);
  const roomToPopulate = getRoom(roomName);
  rooms[rooms.indexOf(roomToPopulate)].members.push(newMember);
  emitData();
}

function removeMemberData(socket: SocketIO.Socket, roomName: string) {
  const memberToRemove = getUser(socket.id);
  const roomToUpdate = getRoom(roomName);
  // If the member was alone in the room - return
  if (!memberToRemove) return;
  const index = roomToUpdate.members.findIndex(
    (member) => member.id === memberToRemove.id
  );
  rooms[rooms.indexOf(roomToUpdate)].members.splice(index, 1);
  emitData();
}

function updateRoomsData(roomName: string) {
  const index = rooms.findIndex((room) => room.name === roomName);
  if (!rooms[index].members.length) {
    rooms.splice(index, 1);
  }
  emitData();
}

function getUser(id: string): User {
  return users.find((user) => user.id === id);
}

function getRoom(name: string): Room {
  return rooms.find((room) => room.name === name);
}

function emitData() {
  io.emit("update data", { rooms, users });
}

server.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);
