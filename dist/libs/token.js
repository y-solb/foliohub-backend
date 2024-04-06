"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccessTokenCookie = exports.setTokenCookie = exports.decodeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, options) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not defined');
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, options);
};
exports.generateToken = generateToken;
const decodeToken = (token) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not defined');
    }
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
};
exports.decodeToken = decodeToken;
function setTokenCookie(res, tokens) {
    const { accessToken, refreshToken } = tokens;
    res.cookie('accessToken', accessToken, {
        path: '/',
        maxAge: 1000 * 60 * 60, // 1시간
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
    });
    res.cookie('refreshToken', refreshToken, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
    });
}
exports.setTokenCookie = setTokenCookie;
function setAccessTokenCookie(res, accessToken) {
    res.cookie('accessToken', accessToken, {
        path: '/',
        maxAge: 1000 * 60 * 60, // 1시간
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        domain: process.env.DOMAIN,
    });
}
exports.setAccessTokenCookie = setAccessTokenCookie;
