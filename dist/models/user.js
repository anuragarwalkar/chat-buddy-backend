"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const clientSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8
    },
    fullName: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        default: 'notProvided'
    },
    googleId: {
        type: String,
        default: 'notOauth'
    }
}, {
    versionKey: false,
    strict: true,
    timestamps: true
});
const clientModel = mongoose_1.default.model("Users", clientSchema);
exports.default = clientModel;
