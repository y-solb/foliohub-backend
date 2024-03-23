"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const portfolio_1 = __importDefault(require("./portfolio"));
const metadata_1 = __importDefault(require("./metadata"));
const user_1 = __importDefault(require("./user"));
const job_categoty_1 = __importDefault(require("./job-categoty"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/portfolio', portfolio_1.default);
router.use('/metadata', metadata_1.default);
router.use('/user', user_1.default);
router.use('/job-category', job_categoty_1.default);
exports.default = router;
