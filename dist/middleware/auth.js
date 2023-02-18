"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorResponse_1 = __importDefault(require("../shared/errorResponse"));
const config_1 = __importDefault(require("config"));
const { jwtPrivateKey } = config_1.default;
const auth = (req, res, next) => {
    let authHeader = null;
    let cookieToken = null;
    let token = '';
    // Get the Authorization token if provided in header.
    authHeader = req.header('authorization');
    // Get the Access Token if provided in cookies.
    if (req.cookies)
        cookieToken = req.cookies.access_token;
    // Setting token from header if present.
    if (authHeader)
        token = authHeader.split(" ")[1];
    // Setting token from cookie if present.
    if (cookieToken)
        token = cookieToken;
    // If header and cookies are not present.
    if (!authHeader && !cookieToken) {
        return next(new errorResponse_1.default('Access denied. No token provided.', 401));
    }
    // Checkig JWT.
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtPrivateKey);
        // Adding decoded user in request object
        req.user = decoded;
        // Allowing if token is valid.
        next();
    }
    catch (error) {
        return next(new errorResponse_1.default('Invalid token.', 401));
    }
};
exports.default = auth;
