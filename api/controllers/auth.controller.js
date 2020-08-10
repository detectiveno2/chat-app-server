const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../../models/user.model');

const {
  OK_STATUS,
  CREATED_STATUS,
  BAD_REQUEST_STATUS,
  UNAUTHORIZED_STATUS,
  FORBIDDEN_STATUS,
} = require('../constants/httpStatus.constant');

module.exports.index = async (req, res) => {
  // Check authentication
  const token = req.headers['authorization'];

  if (token === 'null') {
    return res.status(UNAUTHORIZED_STATUS).send('Unauth.');
  }

  // Check if wrong token
  const jwtToken = token.split(' ')[1];
  try {
    const data = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ email: data.email });

    return res.status(OK_STATUS).send(user);
  } catch (error) {
    return res.status(FORBIDDEN_STATUS).send('Wrong token.');
  }
};

module.exports.postRegister = async (req, res) => {
  const { email, userName, password } = req.body;

  // Check if email has been used.
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(BAD_REQUEST_STATUS).send('Email has been used.');
  }

  // Check if userName has been taken.
  const existingUser = await User.findOne({ userName });
  if (existingUser) {
    return res.status(BAD_REQUEST_STATUS).send('Username has been taken');
  }

  // Hash password
  const rounds = 10;
  const salt = await bcrypt.genSalt(rounds);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create default avatar
  const avatarUrl = process.env.DEFAULT_AVATAR_URL;

  // Create new user
  const newUser = new User({
    email,
    userName,
    avatarUrl,
    password: hashedPassword,
    rooms: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    return res.status(BAD_REQUEST_STATUS).send(error);
  }

  // Generate token
  const payload = { email, userName, avatarUrl };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  return res.status(CREATED_STATUS).json({ token });
};

module.exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  // Check email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(BAD_REQUEST_STATUS).send('Email is not existed.');
  }

  // Check password
  const authPassword = await bcrypt.compare(password, user.password);
  if (!authPassword) {
    return res.status(BAD_REQUEST_STATUS).send('Wrong password.');
  }

  // Generate token
  const payload = {
    email,
    userName: user.userName,
    avatarUrl: user.avatarUrl,
  };

  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    return res.status(OK_STATUS).json({ token });
  } catch (error) {
    return res.status(BAD_REQUEST_STATUS).send('Error: ', error);
  }
};
