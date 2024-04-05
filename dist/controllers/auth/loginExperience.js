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
exports.loginExperience = void 0;
const User_1 = require("../../entities/User");
const data_source_1 = require("../../data-source");
const token_1 = require("../../libs/token");
const customError_1 = require("../../libs/customError");
/**
 * 체험 로그인
 * POST /v1/auth/loginExperience
 */
const loginExperience = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (!code || code !== 'HelloWorld') {
        return next(new customError_1.CustomError(400, 'General', '타당하지 않은 code입니다.'));
    }
    try {
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: {
                providerId: 'test',
            },
        });
        if (!user) {
            return next(new customError_1.CustomError(404, 'General', '해당 user가 존재하지 않습니다.'));
        }
        const token = yield user.generateUserToken();
        (0, token_1.setTokenCookie)(res, token);
        return res.json({
            success: true,
            message: '체험 로그인이 완료되었습니다.',
        });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.loginExperience = loginExperience;
