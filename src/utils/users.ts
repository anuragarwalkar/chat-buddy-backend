import usersModel from '../models/user';
import { User } from '../shared/models/user.model';

let users: User[] = [];
const onlineUsers: { [key: string]: boolean } = { }

export const removeUser = (userId: string): boolean => {
    let isUserRemoved = false;
    for (let [index, client] of users.entries())
        if (client.userId === userId) {
            users.splice(index, 1);
            isUserRemoved = true;
            break;
        }

    return isUserRemoved;
}

export const getUserById = (userId: string): User | undefined => {
    return users.find(user => {
        onlineUsers[userId] = true;
        return user.userId === userId
    })
}

export const joinUser = async (userId: string) => {
    const isUserExists = getUserById(userId);

    if (!isUserExists) {
        const user: any = await usersModel.findById(userId).lean();
        user.userId = user._id.toString();
        delete user.password;
        delete user._id

        users.push(user);
        onlineUsers[userId] = true;
        return true;
    }


    return false;
}

export const getIsUserOnline = (userId: string) => {
    return onlineUsers[userId] === true;
}