const socketioEmitter = require('socket.io-emitter');

const hostPortRedis = { host: '127.0.0.1', port: 6379 };

if (process.env.REDIS_URL) {
  var _io = socketioEmitter(process.env.REDIS_URL);
} else {
  var _io = socketioEmitter(hostPortRedis);
}

module.exports = _io;
