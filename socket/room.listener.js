const roomListener = {
  connectPersonalRoom: (socket) => {
    const event = 'connectPersonalRoom';

    return socket.on(event, (data) => {
      const room = data;

      socket.join(room);
    });
  },

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
    });
  },
};

module.exports = roomListener;
