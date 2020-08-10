const {
  OK_STATUS,
  CREATED_STATUS,
} = require('../constants/httpStatus.constant');
const Room = require('../../models/room.model');
const _io = require('../../socket/socket.emitter');

module.exports.index = async (req, res) => {
  const data = req.user;

  return res.status(OK_STATUS).json(data);
};

module.exports.getMessages = async (req, res) => {
  res.json('testBoy');
};

module.exports.postSendMessages = async (req, res) => {
  const { idRoom, idSender, content } = req.body;
  const room = await Room.findOne({ _id: idRoom });

  // Generate message
  const message = { content, author: idSender };

  await room.updateOne({ $push: { messages: message } });
  const updatedRoom = await Room.findOne({ _id: idRoom });

  _io.to(idRoom).emit('replySendMessage', { messages: updatedRoom.messages });

  return res.status(CREATED_STATUS).json(room.messages);
};
