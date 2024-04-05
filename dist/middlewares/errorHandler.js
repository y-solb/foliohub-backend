"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error, req, res, next) => {
    return res.status(error.HttpStatusCode).json(error.JSON);
};
exports.default = errorHandler;
