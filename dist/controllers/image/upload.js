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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const customError_1 = require("../../libs/customError");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const IMAGETYPES = ['thumbnail', 'asset'];
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params;
    if (!IMAGETYPES.includes(type)) {
        return next(new customError_1.CustomError(400, 'General', `해당 ${type} type은 존재하지 않습니다.`));
    }
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const file = req.file.path;
        const result = yield cloudinary_1.v2.uploader.upload(file, {
            resource_type: 'image',
            folder: type,
            // width: 600,
            crop: 'scale',
        });
        fs_1.default.unlink(req.file.path, (err) => {
            if (err) {
                console.error(err);
            }
            res.json({
                imageUrl: `${process.env.CLOUDINARY_BASE_URL}/${result.public_id}.${result.format}`,
            });
        });
    }
    catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
        res.status(500).json({ error: '이미지 업로드 중 오류 발생' });
    }
});
exports.uploadImage = uploadImage;
