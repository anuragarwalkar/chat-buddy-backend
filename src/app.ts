import { server, io, port } from './config/server';

io.on('connection', (socket) => {
  socket.emit('request', /* … */); // emit an event to the socket
  io.emit('broadcast', /* … */); // emit an event to all connected sockets
  socket.on('reply', () => { /* … */ }); // listen to the event
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});