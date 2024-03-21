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
exports.logout = void 0;
const customError_1 = require("../../libs/customError");
/**
 * 로그아웃
 * GET /v1/auth/logout
 */
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: AuthToken에서 삭제해야 하는지
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json('success');
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.logout = logout;
