const joinRoom = (socket, namespace) => ({ username, room }) => {
  socket.join(room, () => {
    // push user for the suitable room
    users[room].push({ username: username, privateChat: false });
    // Notify all the users in the same room
    namespace.in(room).emit("newUser", users[room]);
  });
};

const publicMessage = (namespace) => ({ room, message, username }) => {
  namespace.sockets.in(room).emit("newMessage", { message, username });
};
const privateMessage = (namespace) => ({ privateMessage, to, from, room }) => {
  namespace.to(room).emit("privateMessage", { to, privateMessage, from, room });
};
const leaveRoom = (socket, namespace) => ({ room, username }) => {
  socket.leave(room, () => {
    let usersRoom = users[room];
    usersRoom = usersRoom.filter((user) => user.username !== username); // delete user from the array
    namespace.sockets.in(room).emit("newUser", usersRoom); // To all the users in the same room
  });
};
const joinPrivateRoom = (socket, namespace) => ({ username, room, to }) => {
  socket.join(to, () => {
    if (room !== null) {
      let usersRoom = users[room];
      let userToTalk = usersRoom.find((user) => user.username === to);

      if (userToTalk.privateChat) {
        // If he is already talking
        namespace.to(to).emit("leavePrivateRoom", {
          to,
          room,
          from: username,
          privateMessage: `${to} is already talking`,
        });
        socket.leave(to, () => {
          console.log(`user ${username} forced to left the room ${to}`);
        });
        return;
      }
      // If the user is not talking we update the flag and notify the other user
      userToTalk.privateChat = true;
      namespace.sockets.in(room).emit("privateChat", { username, to });
    }
  });
};
const leavePrivateRoom = (socket, namespace) => ({ room, from, to }) => {
  let usersRoom = users[room];
  let userToTalk = usersRoom.find((user) => user.username === to);
  // Update the flag and notify the other user
  userToTalk.privateChat = false;
  namespace.to(to).emit("leavePrivateRoom", {
    to,
    from,
    privateMessage: `${to} has closed the chat`,
  });
  socket.leave(to, () => {
    console.log(`user ${from} left the private chat with ${to}`);
  });
};

const privateMessagePCSignaling = (namespace) => ({ desc, to, from, room }) => {
  // Private signaling message to the user
  // desc is the local session description of the user emitting the event
  namespace.to(room).emit("privateMessagePCSignaling", { desc, to, from });
};

module.exports = {
  joinRoom,
  publicMessage,
  privateMessage,
  leaveRoom,
  joinPrivateRoom,
  privateMessagePCSignaling,
};
