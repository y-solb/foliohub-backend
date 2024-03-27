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
exports.register = void 0;
const token_1 = require("../../libs/token");
const User_1 = require("../../entities/User");
const data_source_1 = require("../../data-source");
const customError_1 = require("../../libs/customError");
const Portfolio_1 = require("../../entities/Portfolio");
const SocialLink_1 = require("../../entities/SocialLink");
/**
 * 회원가입
 * GET /v1/auth/register
 */
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, displayName } = req.body;
        const { registerToken } = req.cookies;
        if (!username || !displayName) {
            return next(new customError_1.CustomError(400, 'Validation', '해당 이름 또는 ID값이 존재하지 않습니다.'));
        }
        if (!registerToken) {
            return next(new customError_1.CustomError(400, 'General', '회원가입을 처음부터 다시 시도해 주세요.'));
        }
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const existingUsername = yield userRepository.findOne({
            where: {
                username,
            },
        });
        if (existingUsername) {
            return next(new customError_1.CustomError(400, 'General', '해당 ID을 사용하는 사용자가 존재합니다.'));
        }
        const { email, provider, providerId } = (0, token_1.decodeToken)(registerToken);
        const user = new User_1.User();
        user.email = email;
        user.username = username;
        user.provider = provider;
        user.providerId = providerId;
        yield userRepository.save(user);
        const portfolio = new Portfolio_1.Portfolio();
        portfolio.userId = user.id;
        portfolio.displayName = displayName;
        yield data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio).save(portfolio);
        const socialLink = new SocialLink_1.SocialLink();
        socialLink.userId = user.id;
        yield data_source_1.AppDataSource.getRepository(SocialLink_1.SocialLink).save(socialLink);
        res.clearCookie('registerToken');
        const token = yield user.generateUserToken();
        (0, token_1.setTokenCookie)(res, token);
        res.json('success');
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.register = register;
