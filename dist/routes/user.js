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
const user_1 = __importDefault(require("../models/user"));
const usersAggregate_1 = require("../query/usersAggregate");
const users_1 = require("../utils/users");
const router = express_1.default.Router();
router.get('/single/:userId', async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const [user] = yield user_1.default.aggregate(usersAggregate_1.getUser(userId));
    res.send({ success: true, data: user });
})));
router.get('/:userId', async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    let users = yield user_1.default.aggregate(usersAggregate_1.getAllUsers(userId));
    users = users.map(user => {
        user.isOnline = users_1.getIsUserOnline(user.userId);
        return user;
    });
    res.send({ success: true, data: users });
})));
exports.default = router;
