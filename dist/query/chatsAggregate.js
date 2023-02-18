"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Types: { ObjectId } } = mongoose_1.default;
exports.getChatHistory = (sender, recipient) => {
    return [
        {
            $match: {
                $or: [{ $and: [{ sender: ObjectId(sender) },
                            { recipient: ObjectId(recipient) }] },
                    { $and: [{ sender: ObjectId(recipient) },
                            { recipient: ObjectId(sender) }] }]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "senderUserDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "recipient",
                foreignField: "_id",
                as: "recepientUserDetails"
            }
        },
        {
            $addFields: {
                isSender: {
                    $cond: {
                        if: { $eq: ["$sender", ObjectId(sender)] },
                        then: true,
                        else: false,
                    },
                },
                recepientUserDetails: { "$arrayElemAt": ["$recepientUserDetails", 0] },
                senderUserDetails: { "$arrayElemAt": ["$senderUserDetails", 0] }
            }
        },
        {
            $project: {
                _id: 0,
                fullName: "$senderUserDetails.fullName",
                message: 1,
                createdAt: 1,
                isSender: 1
            }
        }
    ];
};
