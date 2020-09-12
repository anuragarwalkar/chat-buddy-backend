import express from 'express';
import sockets from 'socket.io';
import http from 'http';
import auth from './routes/auth';
import errorLogger from './middleware/logger';
import mongoDBConnection from './config/mongoDB';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotEnv from 'dotenv';

// Environemt Config
dotEnv.config()

// Calling mongodb conncection method
mongoDBConnection()

const app = express();
const server = http.createServer(app);
const io = sockets(server);
const port = 3000;

// 3rd party cors module
app.use(cors({
  credentials:true
}));

// Read Cookies
app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Auth Routes
app.use('/api/auth', auth);

// Root Router 
app.get('/', (req, res) => {
  res.send('App is running...');
});

// Error logger
app.use(errorLogger);

io.on('connection', (socket) => {
  socket.emit('request', /* … */); // emit an event to the socket
  io.emit('broadcast', /* … */); // emit an event to all connected sockets
  socket.on('reply', () => { /* … */ }); // listen to the event
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})