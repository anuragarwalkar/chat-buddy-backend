import express from 'express';
import sockets from 'socket.io';
import http from 'http';
import auth from './routes/auth';
const app = express();
const server = http.createServer(app);
const io = sockets(server);
const port = 3000;

app.get('/', (req, res) => {
  res.send('App is running...');
});

app.use('/api/auth', auth);

io.on('connection', (socket) => {
  socket.emit('request', /* … */); // emit an event to the socket
  io.emit('broadcast', /* … */); // emit an event to all connected sockets
  socket.on('reply', () => { /* … */ }); // listen to the event
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})