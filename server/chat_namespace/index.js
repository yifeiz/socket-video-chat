const events = require("./events.js");
const config = require("./../config");
const ChatRedis = require("../redis");

let namespace;

const onConnection = (socket) => {
  console.log(`Socket connected to port ${config.PORT}`);

  let userRoom;

  socket.on("joinRoom", ({ username, room, status }) => {
    console.log(`user ${username} wants to join the room ${room}`);

    // Join the room
    socket.join(room, () => {
      console.log(`user ${username} joined the room ${room}`);
      // We implement here the listener to save the room where the user is
      userRoom = room;

      // add user for the suitable ROOM
      ChatRedis.addUser(room, socket.id, {
        username,
        status,
        privateChat: false,
      });

      ChatRedis.getUsers(room).then((users) => {
        if (users === null) return;

        // Notify all the users in the same room
        namespace.in(room).emit("newUser", { users, username });
      });
    });
  }); // Join a room
  socket.on("publicMessage", events.publicMessage(namespace)); // New public messages
  socket.on("leaveRoom", events.leaveRoom(socket, namespace)); // Leave room
  socket.on("leaveChat", events.leaveChat(socket, namespace)); // Leave the chat
  socket.on("joinPrivateRoom", events.joinPrivateRoom(socket, namespace)); // Join private chat
  socket.on("leavePrivateRoom", events.leavePrivateRoom(socket, namespace)); // Leave private chat
  socket.on("privateMessage", events.privateMessage(namespace)); // Private message
  socket.on("changeStatus", events.changeStatus(socket, namespace)); // // Set status
  socket.on(
    "privateMessagePCSignaling",
    events.privateMessagePCSignaling(namespace)
  );
};

exports.createNameSpace = (io) => {
  namespace = io.of(config.CHAT_NAMESPACE).on("connection", onConnection);
};
