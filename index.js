const http = require('http');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const redis = require('socket.io-redis');

dotenv.config();
const app = express();
const port = process.env.PORT || 5400;
const server = http.createServer(app);

// Route for api.
const apiAuthRoute = require('./api/routes/auth.route');
const apiMessagesRoute = require('./api/routes/messages.route');
const apiRoomsRoute = require('./api/routes/rooms.route');

// Middleware for api.
const authMiddleware = require('./api/middlewares/auth.middleware');

// Listeners socket.
const roomListener = require('./socket/room.listener');

// Connect MONGODB.
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Using middleware.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define routes api.
app.use('/api/auth', apiAuthRoute);
app.use('/api/messages', authMiddleware.checkAuth, apiMessagesRoute);
app.use('/api/rooms', authMiddleware.checkAuth, apiRoomsRoute);

// Define root url.
app.get('/', (req, res) => {
  res.send('Chat-app-server.');
});

// SocketIO
const io = socketio(server);
io.adapter(redis({ host: 'localhost', port: 6379 }));

io.on('connect', (socket) => {
  console.log(`${socket.id} has connected.`);
  // Room listener
  roomListener.connectPersonalRoom(socket);
  roomListener.connectRooms(socket);
  roomListener.createRoom(socket);
  roomListener.joinRoom(socket);

  socket.on('disconnect', () => {
    console.log('Disconnected.');
  });
});

// Listen server
server.listen(port, () => console.log(`Chat-app-server is running on ${port}`));
