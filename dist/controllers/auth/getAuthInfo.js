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
exports.getAuthInfo = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const User_1 = require("../../entities/User");
const utils_1 = require("../../libs/utils");
const getAuthInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user === null)
            return res.json(null);
        // 로그인 상태
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepository.findOne({
            where: {
                id: req.user.id,
            },
            relations: ['portfolio'],
        });
        if (!user)
            return next(new customError_1.CustomError(401, 'Unauthorized', '해당 user가 존재하지 않습니다.'));
        const { portfolio, id, username } = user;
        return res.json({
            id,
            username,
            thumbnail: portfolio.thumbnail ? (0, utils_1.prependCloudinaryBaseUrl)(portfolio.thumbnail) : null,
        });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.getAuthInfo = getAuthInfo;
