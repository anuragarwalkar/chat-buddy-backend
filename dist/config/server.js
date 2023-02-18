"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = exports.io = exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../routes/auth"));
const logger_1 = __importDefault(require("../middleware/logger"));
const mongoDB_1 = __importDefault(require("../config/mongoDB"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_2 = __importDefault(require("../middleware/auth"));
const config = __importStar(require("config"));
const user_1 = __importDefault(require("../routes/user"));
const chat_1 = __importDefault(require("../routes/chat"));
const errorResponse_1 = __importDefault(require("../shared/errorResponse"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("../config/passport"));
passport_2.default(passport_1.default);
// Environemt Config
dotenv_1.default.config();
const { jwtPrivateKey, origin } = config;
const app = express_1.default();
const server = http_1.default.createServer(app);
exports.server = server;
const io = socket_io_1.default(server);
exports.io = io;
// To Enable Https
app.enable("trust proxy");
// Calling mongodb conncection method
mongoDB_1.default();
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const port = process.env.PORT || 3000;
exports.port = port;
// 3rd party cors module
app.use(cors_1.default({
    origin,
    credentials: true,
}));
// Read Cookies
app.use(cookie_parser_1.default());
// parse application/json
app.use(body_parser_1.default.json());
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.urlencoded({ extended: false }));
// Set Static folder
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// Authenticating middlware
// ------------- Important -------------------------------------------------------
if (!jwtPrivateKey) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}
;
// Passport Middelware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Validate JWT Token on every request
app.use('/api/v1', auth_2.default);
// ------------------------------------------------------------------------------
// Auth Routes
app.use('/api/auth', auth_1.default);
// Users Routes 
app.use('/api/v1/user', user_1.default);
// Chat Routes 
app.use('/api/v1/chat', chat_1.default);
// Error logger
app.use(logger_1.default);
// Socket Authentication
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jsonwebtoken_1.default.verify(socket.handshake.query.token, jwtPrivateKey, (err, decoded) => {
            if (err)
                return next(new errorResponse_1.default('Authentication error', 401));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new errorResponse_1.default('Authentication error', 401));
    }
});
