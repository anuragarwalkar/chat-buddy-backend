import usersModel from '../models/user';

let users: any[] = [];

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

export const getUserById = (userId: string) => {
    return users.find(user => user.userId === userId)
}

export const joinUser = async (userId: string) => {
    const isUserExists = getUserById(userId);

    if(!isUserExists) {
        const user: any = await usersModel.findById(userId).lean();
        user.userId = user._id.toString();
        delete user.password;
        delete user._id

        users.push(user);
        return true;
    }


    return false;
}