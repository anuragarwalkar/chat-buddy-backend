import { server, io, port } from './config/server';
import { joinUser, getUserById, removeUser } from './utils/users';
import { formatMessage } from './utils/utils';
import { insertChatToDb } from './controller/chat';


io.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId;

  const userAdded = await joinUser(userId);

  if(userAdded) {
    socket.join(userId);
  }
  
  console.log('connected client:', userId)

  socket.on('sendMessage', async ({message, to, from}) => {

    const toUser = getUserById(to);
    const fromUser = getUserById(from);

    try {
      await insertChatToDb(from, to, message);
    } catch (error) {
      console.error('error:', error)
    }

    if (toUser && toUser.userId) {
      io.to(toUser.userId).emit('receiveMessage', 
      {...formatMessage(fromUser.fullName, message), recipientId: fromUser.userId});
    }
  })


  socket.on('disconnect', () => {
    const disconnectedClient = socket.handshake.query.userId;
    removeUser(disconnectedClient);
    console.log('Disconnected Client:', disconnectedClient)
  });

  socket.on('forceDisconnect', () => {
    const forceDisconnectedClient = socket.handshake.query.userId;
    socket.disconnect();
    removeUser(forceDisconnectedClient);
    console.log('Force Disconnected Client:', forceDisconnectedClient)
  })
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});