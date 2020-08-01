const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String },
  userName: { type: String },
  avatarUrl: { type: String },
  password: { type: String },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
