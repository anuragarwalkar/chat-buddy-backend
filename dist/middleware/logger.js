"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (err, req, res, next) => {
    const error = Object.assign({}, err);
    error['message'] = err.message;
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        error: errorMessage
    });
};
exports.default = logger;
