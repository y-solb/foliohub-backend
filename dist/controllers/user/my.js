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
exports.my = void 0;
const JobCategory_1 = require("./../../entities/JobCategory");
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const User_1 = require("../../entities/User");
const Portfolio_1 = require("../../entities/Portfolio");
const my = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { id } = req.user;
    try {
        const UserRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield UserRepository.findOne({
            where: {
                id,
            },
            select: ['id', 'username'],
        });
        if (!user) {
            return next(new customError_1.CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
        }
        const portfolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portfolioRepository.findOne({
            where: {
                userId: user.id,
            },
            select: ['displayName', 'thumbnail', 'jobCategoryCode'],
        });
        if (!portfolio) {
            return next(new customError_1.CustomError(400, 'General', '해당 portfolio가 존재하지 않습니다.'));
        }
        if (!portfolio.jobCategoryCode) {
            return res.json(Object.assign(Object.assign(Object.assign({}, user), portfolio), { job: null, jobCode: null }));
        }
        const JobCategoryRepository = data_source_1.AppDataSource.getRepository(JobCategory_1.JobCategory);
        const jobCategory = yield JobCategoryRepository.findOne({
            where: {
                code: portfolio.jobCategoryCode,
            },
            select: ['code', 'name'],
        });
        return res.json(Object.assign(Object.assign(Object.assign({}, user), portfolio), { job: jobCategory === null || jobCategory === void 0 ? void 0 : jobCategory.name, jobCode: jobCategory === null || jobCategory === void 0 ? void 0 : jobCategory.code }));
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.my = my;
