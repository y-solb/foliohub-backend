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
exports.unlikePortfolio = exports.likePortfolio = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const LikePortfolio_1 = require("../../entities/LikePortfolio");
const Portfolio_1 = require("../../entities/Portfolio");
/**
 * 좋아요
 * POST /v1/portfolio/like/:portfolioId
 */
const likePortfolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { id } = req.user;
    if (!id) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { portfolioId } = req.params;
    if (!portfolioId) {
        return next(new customError_1.CustomError(400, 'Validation', '해당 portfolioId값이 존재하지 않습니다.'));
    }
    try {
        const likePortFolioRepository = data_source_1.AppDataSource.getRepository(LikePortfolio_1.LikePortfolio);
        const existingLike = yield likePortFolioRepository.findOne({
            where: { portfolioId: portfolioId, userId: id },
        });
        if (existingLike) {
            existingLike.status = true;
            yield likePortFolioRepository.save(existingLike);
        }
        else {
            const newLike = new LikePortfolio_1.LikePortfolio();
            newLike.portfolioId = portfolioId;
            newLike.userId = id;
            newLike.status = true;
            yield likePortFolioRepository.save(newLike);
        }
        const portFolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portFolioRepository.findOne({
            where: { id: portfolioId },
        });
        if (!portfolio) {
            return next(new customError_1.CustomError(404, 'General', '해당 portfolioId값이 존재하지 않습니다.'));
        }
        portfolio.likeCount = portfolio.likeCount + 1;
        yield portFolioRepository.save(portfolio);
        return res.json({
            success: true,
            message: '좋아요가 성공적으로 업데이트되었습니다.',
            isLike: true,
            likeCount: portfolio.likeCount,
        });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.likePortfolio = likePortfolio;
/**
 * 좋아요 취소
 * POST /v1/portfolio/unlike/:portfolioId
 */
const unlikePortfolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { id } = req.user;
    if (!id) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { portfolioId } = req.params;
    if (!portfolioId) {
        return next(new customError_1.CustomError(400, 'Validation', '해당 portfolioId값이 존재하지 않습니다.'));
    }
    try {
        const likePortFolioRepository = data_source_1.AppDataSource.getRepository(LikePortfolio_1.LikePortfolio);
        const existingLike = yield likePortFolioRepository.findOne({
            where: { portfolioId: portfolioId, userId: id },
        });
        if (!existingLike) {
            return next(new customError_1.CustomError(404, 'General', '해당 좋아요 값이 존재하지 않습니다.'));
        }
        existingLike.status = false;
        yield likePortFolioRepository.save(existingLike);
        const portFolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portFolioRepository.findOne({
            where: { id: portfolioId },
        });
        if (!portfolio) {
            return next(new customError_1.CustomError(404, 'General', '해당 portfolioId값이 존재하지 않습니다.'));
        }
        portfolio.likeCount = portfolio.likeCount - 1;
        yield portFolioRepository.save(portfolio);
        return res.json({
            success: true,
            message: '좋아요가 성공적으로 업데이트되었습니다.',
            isLike: false,
            likeCount: portfolio.likeCount,
        });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.unlikePortfolio = unlikePortfolio;
