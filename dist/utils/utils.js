"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAuthToken = exports.formatMessage = void 0;
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { jwtPrivateKey } = config_1.default;
// import moment from 'moment';
exports.formatMessage = (username, message) => {
    return {
        username,
        message,
        time: new Date()
    };
};
exports.generateAuthToken = (userId, username, fullName, email) => {
    return jsonwebtoken_1.default.sign({ user: { username, fullName, email, userId } }, jwtPrivateKey);
};
