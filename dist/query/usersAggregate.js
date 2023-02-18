"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getAllUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Types: { ObjectId } } = mongoose_1.default;
exports.getAllUsers = (userId) => {
    return [
        {
            $match: {
                _id: { $ne: ObjectId(userId) },
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullName: 1,
                userId: '$_id',
                _id: 0,
                picture: 1
            }
        }
    ];
};
exports.getUser = (userId) => {
    return [
        {
            $match: {
                _id: { $eq: ObjectId(userId) },
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                fullName: 1,
                userId: '$_id',
                _id: 0,
                picture: 1
            }
        }
    ];
};
