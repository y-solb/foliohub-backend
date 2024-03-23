"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./../../controllers/metadata/index");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', index_1.extractUrlMetadata);
exports.default = router;
