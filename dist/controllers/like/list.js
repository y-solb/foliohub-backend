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
exports.listLike = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const LikePortfolio_1 = require("../../entities/LikePortfolio");
const JobCategory_1 = require("../../entities/JobCategory");
const User_1 = require("../../entities/User");
const listLike = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { id } = req.user;
    const currentPage = Number(req.query.page) || 0;
    const perPage = Number(req.query.count) || 10;
    if (currentPage < 0) {
        return next(new customError_1.CustomError(400, 'General', '잘못된 페이지 값입니다. 페이지 값은 0 이상의 정수여야 합니다.'));
    }
    try {
        const [portfolios, total] = yield data_source_1.AppDataSource.getRepository(LikePortfolio_1.LikePortfolio).findAndCount({
            order: { updatedAt: 'DESC' },
            select: ['id', 'portfolioId', 'userId', 'status', 'updatedAt'],
            where: {
                status: true,
                userId: id,
            },
            relations: ['portfolio'],
            skip: (currentPage - 1) * perPage,
            take: perPage,
        });
        const portfolioList = yield Promise.all(portfolios.map((p) => __awaiter(void 0, void 0, void 0, function* () {
            const { portfolio: { id, displayName, shortBio, thumbnail, likeCount, userId, jobCategoryCode }, } = p;
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepository.findOne({
                where: {
                    id: userId,
                },
                select: ['username'],
            });
            if (!user)
                return;
            const jobCategoryRepository = data_source_1.AppDataSource.getRepository(JobCategory_1.JobCategory);
            const jobCategory = yield jobCategoryRepository.findOne({
                where: {
                    code: jobCategoryCode,
                },
                select: ['name'],
            });
            return {
                username: user.username,
                userJob: jobCategory ? jobCategory.name : null,
                id,
                displayName,
                shortBio,
                thumbnail,
                likeCount,
                userId,
            };
        })));
        return res.json({
            data: portfolioList,
            meta: {
                total,
                currentPage,
                lastPage: Math.ceil(total / perPage),
                hasNextPage: Math.ceil(total / perPage) === currentPage ? false : true,
            },
        });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.listLike = listLike;
