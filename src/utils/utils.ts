import config from 'config';
import jwt from 'jsonwebtoken';
import { Config } from '../shared/models/config.model';
const { jwtPrivateKey } = config as Config;
// import moment from 'moment';

export const formatMessage = (username: string, message: string) => {
    return {
        username,
        message,
        time: new Date()
    }
}

export const generateAuthToken = (userId: string, username: string,
    fullName: string, email: string) => {
    return jwt.sign({ user: { username, fullName, email, userId } }, jwtPrivateKey);
}