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
exports.editJobCategory = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const Portfolio_1 = require("../../entities/Portfolio");
/**
 * 직업 카테고리 수정
 * PUT /v1/job-category
 */
const editJobCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { id } = req.user;
    if (!id) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { jobCode } = req.body;
    if (!jobCode) {
        return next(new customError_1.CustomError(400, 'Validation', '해당 jobCode값이 존재하지 않습니다.'));
    }
    try {
        const portfolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portfolioRepository.findOne({ where: { userId: id } });
        if (!portfolio) {
            return next(new customError_1.CustomError(404, 'General', '해당 portfolio가 존재하지 않습니다.'));
        }
        portfolio.jobCategoryCode = jobCode;
        yield portfolioRepository.save(portfolio);
        return res.json({ success: true, message: '직업이 성공적으로 업데이트되었습니다.' });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.editJobCategory = editJobCategory;
