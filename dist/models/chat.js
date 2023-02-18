"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Types: { ObjectId } } = mongoose_1.default;
const chatSchema = new mongoose_1.default.Schema({
    message: {
        type: String,
        required: true
    },
    sender: {
        type: ObjectId,
        required: true,
        ref: 'users'
    },
    recipient: {
        type: ObjectId,
        required: true,
        ref: 'users'
    }
}, {
    versionKey: false,
    strict: true,
    timestamps: true
});
const clientModel = mongoose_1.default.model("Chats", chatSchema);
exports.default = clientModel;
