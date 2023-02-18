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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceDisconnectUser = exports.dissconnectUser = exports.getIsUserOnline = exports.joinUser = exports.getUserById = exports.removeUser = void 0;
const user_1 = __importDefault(require("../models/user"));
let users = [];
const onlineUsers = {};
exports.removeUser = (userId) => {
    let removedUser;
    for (let [index, client] of users.entries()) {
        if (client.userId === userId) {
            client.isOnline = false;
            delete onlineUsers[userId];
            removedUser = client;
            users.splice(index, 1);
            break;
        }
    }
    return removedUser;
};
exports.getUserById = (userId) => {
    return users.find(user => {
        return user.userId === userId;
    });
};
exports.joinUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = exports.getUserById(userId);
    let user = null;
    if (!existingUser) {
        user = yield user_1.default.findById(userId).lean();
        user.userId = user._id.toString();
        user.isOnline = true;
        delete user.password;
        delete user._id;
        users.push(user);
        onlineUsers[userId] = true;
    }
    return existingUser ? existingUser : user;
});
exports.getIsUserOnline = (userId) => {
    return onlineUsers[userId] === true;
};
exports.dissconnectUser = (socket, io) => {
    return () => {
        const userId = socket.handshake.query.userId;
        const removedUser = exports.removeUser(userId);
        io.emit('diconnectedUser', removedUser);
        console.log('disconnected client:', userId);
    };
};
exports.forceDisconnectUser = (socket, io) => {
    return () => {
        const userId = socket.handshake.query.userId;
        exports.dissconnectUser(userId, io);
        socket.disconnect();
    };
};
