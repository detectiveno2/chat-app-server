const socketioEmitter = require('socket.io-emitter');
const _io = socketioEmitter({ host: '127.0.0.1', port: 6379 });

module.exports = _io;
