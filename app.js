
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000

app.get('/', (req, res) => {
  res.send('App is running...')
});

io.on('connection', socket => {
  socket.emit('request', /* … */); // emit an event to the socket
  io.emit('broadcast', /* … */); // emit an event to all connected sockets
  socket.on('reply', () => { /* … */ }); // listen to the event
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})