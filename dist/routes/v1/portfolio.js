"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const edit_1 = require("../../controllers/portfolio/edit");
const user_1 = __importDefault(require("../../middlewares/user"));
const get_1 = require("../../controllers/portfolio/get");
const list_1 = require("../../controllers/portfolio/list");
const likePortfolio_1 = require("../../controllers/like/likePortfolio");
const list_2 = require("../../controllers/like/list");
const metadata_1 = require("../../controllers/portfolio/metadata");
const router = (0, express_1.Router)();
router.get('/list', list_1.listPortFolio);
router.get('/metadata', metadata_1.metadataPortfolio);
router.get('/:username', user_1.default, get_1.getPortFolio);
router.put('/:username', user_1.default, edit_1.editPortFolio);
router.get('/like/list', user_1.default, list_2.listLike);
router.post('/like/:portfolioId', user_1.default, likePortfolio_1.likePortfolio);
router.post('/unlike/:portfolioId', user_1.default, likePortfolio_1.unlikePortfolio);
exports.default = router;
