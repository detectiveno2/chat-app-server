const {
  OK_STATUS,
  BAD_REQUEST_STATUS,
  CREATED_STATUS,
} = require('../constants/httpStatus.constant');
const Room = require('../../models/room.model');
const User = require('../../models/user.model');

module.exports.index = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });
  const rooms = await Room.find({ members: user.id });

  return res.status(OK_STATUS).json(rooms);
};

module.exports.getRoom = async (req, res) => {
  const id = req.params.idRoom;
  try {
    const room = await Room.findOne({ _id: id });
    return res.status(OK_STATUS).json(room);
  } catch (error) {
    return res
      .status(BAD_REQUEST_STATUS)
      .send('Something wrong, please try again');
  }
};

module.exports.getMemsOnRoom = async (req, res) => {
  const { idRoom } = req.params;
  const members = await User.find({ rooms: idRoom });

  return res.status(OK_STATUS).json(members);
};

module.exports.postCreate = async (req, res) => {
  const { email } = req.user;
  const { roomName, roomPassword } = req.body;

  // Check if room name is taken.
  const room = await Room.findOne({ roomName });
  if (room) {
    return res.status(BAD_REQUEST_STATUS).send('Room name is taken.');
  }

  // Create new room
  const user = await User.findOne({ email });
  const newRoom = new Room({
    roomName,
    password: roomPassword,
    admin: user.id,
    members: [user._id],
  });

  // Save and return data
  try {
    const createdRoom = await newRoom.save();
    // Add room for user
    await User.updateOne({ email }, { $push: { rooms: createdRoom.id } });
    const rooms = await Room.find({ members: user.id });

    return res.status(CREATED_STATUS).json({ rooms, createdRoom: newRoom });
  } catch (error) {
    return res
      .status(BAD_REQUEST_STATUS)
      .send('Something wrong, please try again.');
  }
};

module.exports.postJoin = async (req, res) => {
  const { roomJoinName, roomJoinPassword } = req.body;
  const { email } = req.user;

  const room = await Room.findOne({ roomName: roomJoinName });
  if (!room) {
    return res.status(BAD_REQUEST_STATUS).send('Room does not exist.');
  }

  // Check if user is in room.
  const existedUser = await User.findOne({ rooms: room.id });
  if (existedUser.email === email) {
    return res.status(BAD_REQUEST_STATUS).send('User was in room.');
  }

  // Check password room
  if (roomJoinPassword !== room.password) {
    return res.status(BAD_REQUEST_STATUS).send('Password is incorrect.');
  }

  // Join member in room
  const user = await User.findOne({ email });
  await room.updateOne({ $push: { members: user._id } });
  await user.updateOne({ $push: { rooms: room.id } });

  // Return client rooms
  const rooms = await Room.find({ members: user._id });
  return res.status(OK_STATUS).json({ rooms, updatedRoom: room });
};
