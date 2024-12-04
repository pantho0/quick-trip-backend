"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gloalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message: message,
    });
};
exports.default = gloalErrorHandler;
