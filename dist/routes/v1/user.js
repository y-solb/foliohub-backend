"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../../middlewares/user"));
const my_1 = require("../../controllers/user/my");
const router = (0, express_1.Router)();
router.get('/my', user_1.default, my_1.my);
exports.default = router;
