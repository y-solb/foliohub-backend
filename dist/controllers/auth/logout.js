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
exports.logout = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const AuthToken_1 = __importDefault(require("../../entities/AuthToken"));
/**
 * 로그아웃
 * POST /v1/auth/logout
 */
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return next(new customError_1.CustomError(401, 'Unauthorized', 'refreshToken이 존재하지 않습니다.'));
        }
        const authTokenRepository = data_source_1.AppDataSource.getRepository(AuthToken_1.default);
        yield authTokenRepository.delete({
            token: refreshToken,
        });
        res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
        res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
        res.json({ message: '로그아웃 처리 되었습니다.' });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.logout = logout;
