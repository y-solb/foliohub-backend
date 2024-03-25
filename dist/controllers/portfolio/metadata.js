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
exports.metadataPortfolio = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const User_1 = require("../../entities/User");
const Portfolio_1 = require("../../entities/Portfolio");
const metadataPortfolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { username } = req.query;
    if (typeof username !== 'string')
        return next(new customError_1.CustomError(400, 'General', 'username이 string 타입이 아닙니다.'));
    try {
        const UserRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield UserRepository.findOne({
            where: {
                username: username,
            },
            select: ['id'],
        });
        if (!user) {
            return next(new customError_1.CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
        }
        const portfolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portfolioRepository.findOne({
            where: {
                userId: user.id,
            },
            select: ['thumbnail', 'displayName', 'shortBio'],
        });
        return res.json({
            thumbnail: (_a = portfolio === null || portfolio === void 0 ? void 0 : portfolio.thumbnail) !== null && _a !== void 0 ? _a : null,
            displayName: (_b = portfolio === null || portfolio === void 0 ? void 0 : portfolio.displayName) !== null && _b !== void 0 ? _b : null,
            shortBio: (_c = portfolio === null || portfolio === void 0 ? void 0 : portfolio.shortBio) !== null && _c !== void 0 ? _c : null,
        });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.metadataPortfolio = metadataPortfolio;
