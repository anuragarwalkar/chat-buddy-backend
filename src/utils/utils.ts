// import moment from 'moment';

export const formatMessage = (username: string, message: string) => {
    return {
        username,
        message,
        time: new Date()
    }
}