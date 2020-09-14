import { server, io, port } from './config/server';
import { joinUser, getUserById, removeUser } from './utils/users';
import { formatMessage } from './utils/utils';
import { insertChatToDb } from './controller/chat';
import { User } from './shared/models/user.model';


io.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId;

  // Join user to users array;
  await joinUser(userId);

  socket.join(userId);
  
  console.log('connected client:', userId)

  type sendMessageType =  {message: string, to: string, from: string};
  socket.on('sendMessage', async ({message, to, from}: sendMessageType) => {

    const toUser: any = getUserById(to);
    const fromUser: any = getUserById(from);

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