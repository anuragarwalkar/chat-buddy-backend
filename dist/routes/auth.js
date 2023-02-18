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
const errorResponse_1 = __importDefault(require("../shared/errorResponse"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const passport_1 = __importDefault(require("passport"));
const utils_1 = require("../utils/utils");
const config_1 = __importDefault(require("config"));
const { callbackUrl } = config_1.default;
// import _ from 'lodash';
const router = express_1.default.Router();
router.post('/sign-in', async_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Object Destructuring request body 
    let { email, password } = req.body;
    // If body does not exist email & password throw error to client.
    if (!email || !password)
        return next(new errorResponse_1.default('Invalid email or password', 400));
    // Getting Client Details from collection
    const user = yield user_1.default.findOne({ email });
    if (!user)
        return next(new errorResponse_1.default('Invalid email or password', 400));
    // Validating Credentials 
    const validCredentials = yield bcrypt_1.default.compare(password, user.password);
    // If credentials are not valid throw error to client.
    if (!validCredentials)
        return next(new errorResponse_1.default('Invalid password.', 400));
    const userId = user._id.toString();
    // Generating JWT
    const token = utils_1.generateAuthToken(userId, user.username, user.fullName, email);
    const options = { httpOnly: true };
    const secure = process.env.NODE_ENV !== 'development';
    if (secure) {
        options.sameSite = 'none';
        options.secure = secure;
    }
    res.cookie('access_token', token, options);
    // Sending final response
    res.send({
        success: true, data: {
            user: {
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                userId: user._id
            },
            token
        }
    });
})));
router.post('/sign-up', async_1.default((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, password, email, fullName } = req.body;
    if (!username || !password || !email || !fullName) {
        return next(new errorResponse_1.default('Please send client details', 400));
    }
    // Generating salt to hash a password
    const salt = yield bcrypt_1.default.genSalt(10);
    // Modifying plain text password to hashed one
    password = yield bcrypt_1.default.hash(password, salt);
    // Creating client in clients collection
    const clientDetails = yield user_1.default.create({ username, email, password, fullName });
    // Getting Client details
    const { _id: userId } = clientDetails;
    // Generating JWT
    clientDetails.token = utils_1.generateAuthToken(userId, username, fullName, email);
    const options = { httpOnly: true };
    const secure = process.env.NODE_ENV !== 'development';
    if (secure) {
        options.sameSite = 'none';
        options.secure = secure;
    }
    const { token } = clientDetails;
    // Setting cookie 
    res.cookie('access_token', token, options);
    // Sending final response
    res.status(201).send({ success: true, data: { user: { userId, email, username, fullName }, token } });
})));
// @route   GET /auth/google/callback
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// @desc    Google auth callback
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const options = { httpOnly: true };
    const secure = process.env.NODE_ENV !== 'development';
    if (secure) {
        options.sameSite = 'none';
        options.secure = secure;
    }
    const { _id: userId, username, fullName, email } = req.user;
    const token = utils_1.generateAuthToken(userId, username, fullName, email);
    // Setting cookie 
    res.cookie('access_token', token, options);
    // Redirecting client 
    res.redirect(`${callbackUrl}/auth/?token=${token}`);
});
exports.default = router;
