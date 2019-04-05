const socket = require('queued-socket.io');
require("socket.io-client/package.json");
// Before there is a socket connection, add events. These will be queued and run after the connection is established.
socket.on('ping', () => console.log('ping'));
socket.on('disconnect', () => console.log('disconnected'));
socket.once('ping', () => console.log('One time ping'));
socket.emit('authentication', { token: 'loginToken' }, 1);
 
const options = {
  path: '/socket',
  transports: ['websocket']
};
 
const client = socket.connect('http://localhost:3000', options);
 
console.log(`Socket is ${socket.isConnected() ? 'connected' : 'disconnected'}`);