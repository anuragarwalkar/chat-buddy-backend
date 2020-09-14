import { server, io, port } from './config/server';
import { joinUser, getUserById, dissconnectUser, forceDisconnectUser } from './utils/users';
import { formatMessage } from './utils/utils';
import { insertChatToDb } from './controller/chat';


io.on('connection', async (socket) => {
  const userId = socket.handshake.query.userId;

  // Join user to users array;
  const user = await joinUser(userId);

  socket.join(userId);

  io.emit('connectedUser', user); 
  
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

  socket.on('disconnect', dissconnectUser(socket, io));

  socket.on('forceDisconnect', forceDisconnectUser(socket, io))
});

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});