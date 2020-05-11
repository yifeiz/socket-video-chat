const events = require("./events.js");
const config = require("./../config");

let namespace;

const onConnection = (socket) => {
  console.log(`Socket connected to port ${config.PORT}`);

  socket.on("joinRoom", events.joinRoom(socket, namespace)); // Join a room
  socket.on("publicMessage", events.publicMessage(namespace)); // New public messages
  socket.on("leaveRoom", events.leaveRoom(socket, namespace)); // Leave room
  socket.on("leaveChat", events.leaveChat(socket, namespace)); // Leave the chat
  socket.on("joinPrivateRoom", events.joinPrivateRoom(socket, namespace)); // Join private chat
  socket.on("leavePrivateRoom", events.leavePrivateRoom(socket, namespace)); // Leave private chat
  socket.on("privateMessage", events.privateMessage(namespace)); // Private message
  socket.on("changeStatus", events.changeStatus(socket, namespace)); // // Set status
};

exports.createNameSpace = (io) => {
  namespace = io.of(config.CHAT_NAMESPACE).on("connection", onConnection);
};
