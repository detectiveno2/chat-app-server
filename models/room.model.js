const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  content: { type: String },
  author: { type: String },
  date: { type: Date, default: Date.now },
});

const roomSchema = mongoose.Schema({
  roomName: { type: String, require: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, default: [] }],
  avatarGroupUrl: {
    type: String,
    default: `${process.env.BASE_URL}img/default-avatar-group.jpg`,
  },
  password: { type: String, require: true },
  messages: [{ type: messageSchema, default: [] }],
});

const Room = mongoose.model('Room', roomSchema, 'rooms');

module.exports = Room;
