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
exports.listJobCategory = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const JobCategory_1 = require("../../entities/JobCategory");
function categorizeJobCategories(categories) {
    const categorizedCategories = {};
    categories.forEach((category) => {
        const { code, name } = category;
        const mainCategoryCode = code.slice(0, 2);
        if (!categorizedCategories[mainCategoryCode]) {
            categorizedCategories[mainCategoryCode] = {
                code: mainCategoryCode,
                name: '',
                sub: [],
            };
        }
        if (code.length === 2) {
            return (categorizedCategories[mainCategoryCode].name = name);
        }
        const mainCategory = categorizedCategories[mainCategoryCode];
        mainCategory.sub.push({
            code,
            name,
        });
    });
    return Object.values(categorizedCategories);
}
/**
 * 직업 카테고리
 * GET /v1/job-category/list
 */
const listJobCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobCategories = yield data_source_1.AppDataSource.getRepository(JobCategory_1.JobCategory).find({
            where: {
                isActive: true,
            },
            select: ['code', 'name'],
        });
        return res.json(categorizeJobCategories(jobCategories));
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.listJobCategory = listJobCategory;
