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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPortFolio = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const Portfolio_1 = require("../../entities/Portfolio");
const listPortFolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPage = Number(req.query.page) || 0;
    const perPage = Number(req.query.count) || 10;
    if (currentPage < 0) {
        return next(new customError_1.CustomError(400, 'General', '잘못된 페이지 값입니다. 페이지 값은 0 이상의 정수여야 합니다.'));
    }
    try {
        const [portfolios, total] = yield data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio).findAndCount({
            order: { updatedAt: 'DESC' },
            select: ['id', 'displayName', 'shortBio', 'thumbnail', 'likeCount', 'userId', 'updatedAt'],
            relations: ['user', 'jobCategory'],
            skip: (currentPage - 1) * perPage,
            take: perPage,
        });
        return res.json({
            data: portfolios.map((portfolio) => {
                const { user, jobCategory } = portfolio, rest = __rest(portfolio, ["user", "jobCategory"]);
                return Object.assign({ username: user.username, userJob: jobCategory ? jobCategory.name : null }, rest);
            }),
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
exports.listPortFolio = listPortFolio;
