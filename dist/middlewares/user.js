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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../entities/User");
const token_1 = require("../libs/token");
const data_source_1 = require("../data-source");
const customError_1 = require("../libs/customError");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken, refreshToken } = req.cookies;
        if (!accessToken && !refreshToken) {
            req.user = null;
            return next();
        }
        if (!refreshToken) {
            res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
            res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
            req.user = null;
            return next();
        }
        if (!accessToken) {
            return next(new customError_1.CustomError(401, 'Unauthorized', '유효하지 않은 accessToken입니다.'));
        }
        const { userId } = (0, token_1.decodeToken)(accessToken);
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user)
            return next(new customError_1.CustomError(401, 'Unauthorized', '해당 user가 존재하지 않습니다.'));
        const { id, username } = user;
        req.user = { id, username };
        return next();
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
