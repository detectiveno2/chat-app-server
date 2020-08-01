const roomListener = {
  connectRooms: (socket) => {
    const event = 'connectRooms';

    return socket.on(event, (data) => {
      const rooms = data;

      for (const room of rooms) {
        socket.join(room._id);
      }
    });
  },

  createRoom: (socket) => {
    const event = 'createRoom';

    return socket.on(event, (data) => {
      const room = data;
      socket.join(room._id);
    });
  },

  joinRoom: (socket) => {
    const event = 'joinRoom';

    return socket.on(event, (data) => {
      const room = data;
      socket.join(room._id);
      socket.to(room._id).emit('replyJoinRoom');
    });
  },
};

module.exports = roomListener;
