"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const list_1 = require("../../controllers/jobCategory/list");
const edit_1 = require("../../controllers/jobCategory/edit");
const user_1 = __importDefault(require("../../middlewares/user"));
const router = (0, express_1.Router)();
router.get('/list', list_1.listJobCategory);
router.put('/', user_1.default, edit_1.editJobCategory);
exports.default = router;
