"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res) => {
    return res.status(error.HttpStatusCode).json(error.JSON);
};
exports.default = errorHandler;
