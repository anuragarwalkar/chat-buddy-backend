"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./config/server");
const users_1 = require("./utils/users");
const utils_1 = require("./utils/utils");
const chat_1 = require("./controller/chat");
server_1.io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = socket.handshake.query.userId;
    // Join user to users array;
    const user = yield users_1.joinUser(userId);
    socket.join(userId);
    server_1.io.emit('connectedUser', user);
    console.log('connected client:', userId);
    socket.on('sendMessage', ({ message, to, from }) => __awaiter(void 0, void 0, void 0, function* () {
        const toUser = users_1.getUserById(to);
        const fromUser = users_1.getUserById(from);
        try {
            yield chat_1.insertChatToDb(from, to, message);
        }
        catch (error) {
            console.error('error:', error);
        }
        if (toUser && toUser.userId) {
            server_1.io.to(toUser.userId).emit('receiveMessage', Object.assign(Object.assign({}, utils_1.formatMessage(fromUser.fullName, message)), { recipientId: fromUser.userId }));
        }
    }));
    socket.on('disconnect', users_1.dissconnectUser(socket, server_1.io));
    socket.on('forceDisconnect', users_1.forceDisconnectUser(socket, server_1.io));
}));
server_1.server.listen(server_1.port, () => {
    console.log(`App listening at http://localhost:${server_1.port}`);
});
