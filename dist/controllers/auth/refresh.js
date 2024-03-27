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
exports.refresh = void 0;
const token_1 = require("../../libs/token");
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const AuthToken_1 = __importDefault(require("../../entities/AuthToken"));
/**
 * accessToken 재발급
 * GET /v1/auth/refresh
 */
const refresh = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        return next(new customError_1.CustomError(401, 'Unauthorized', 'refreshToken이 존재하지 않습니다.'));
    try {
        const authTokenRepository = data_source_1.AppDataSource.getRepository(AuthToken_1.default);
        const authToken = yield authTokenRepository.findOne({
            where: {
                token: refreshToken,
            },
        });
        if (!authToken)
            return next(new customError_1.CustomError(401, 'Unauthorized', '해당 token이 존재하지 않습니다.'));
        const accessToken = (0, token_1.generateToken)({
            userId: authToken.userId,
        }, {
            subject: 'access_token',
            expiresIn: '1h',
        });
        (0, token_1.setAccessTokenCookie)(res, accessToken);
        res.json('success');
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.refresh = refresh;
