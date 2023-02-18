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
const express_1 = __importDefault(require("express"));
const async_1 = __importDefault(require("../middleware/async"));
const chat_1 = __importDefault(require("../models/chat"));
const errorResponse_1 = __importDefault(require("../shared/errorResponse"));
const chatsAggregate_1 = require("../query/chatsAggregate");
const router = express_1.default.Router();
router.post('/history', async_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, recipient } = req.body;
    if (!sender && !recipient) {
        return next(new errorResponse_1.default('Please send valid sender and recepient details', 400));
    }
    const chats = yield chat_1.default.aggregate(chatsAggregate_1.getChatHistory(sender, recipient));
    res.send({ success: true, data: chats });
})));
exports.default = router;
