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
exports.getPortFolio = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const Portfolio_1 = require("../../entities/Portfolio");
const Asset_1 = require("../../entities/Asset");
const User_1 = require("../../entities/User");
const LikePortfolio_1 = require("../../entities/LikePortfolio");
const SocialLink_1 = require("../../entities/SocialLink");
const utils_1 = require("../../libs/utils");
const getPortFolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const UserRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield UserRepository.findOne({
            where: {
                username,
            },
        });
        if (!user) {
            return next(new customError_1.CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
        }
        const portfolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portfolioRepository.findOne({
            where: {
                userId: user.id,
            },
        });
        if (!portfolio) {
            return next(new customError_1.CustomError(400, 'General', '해당 portfolio가 존재하지 않습니다.'));
        }
        let isLike = false;
        if (req.user) {
            const LikePortfolioRepository = data_source_1.AppDataSource.getRepository(LikePortfolio_1.LikePortfolio);
            const like = yield LikePortfolioRepository.findOne({
                where: { portfolioId: portfolio.id, userId: req.user.id, status: true },
            });
            if (like) {
                isLike = true;
            }
        }
        const socialLinkRepository = data_source_1.AppDataSource.getRepository(SocialLink_1.SocialLink);
        const socialLink = yield socialLinkRepository.findOne({
            where: {
                userId: user.id,
            },
        });
        const assetRepository = data_source_1.AppDataSource.getRepository(Asset_1.Asset);
        const assets = yield assetRepository.find({
            where: {
                portfolioId: portfolio.id,
                status: true,
            },
        });
        const data = assets.map((asset) => {
            if (asset.type === 'github') {
                return {
                    id: asset.id,
                    type: asset.type,
                    value: { githubId: asset.githubId },
                };
            }
            else if (asset.type === 'content') {
                return {
                    id: asset.id,
                    type: asset.type,
                    value: { content: asset.content },
                };
            }
            else if (asset.type === 'image') {
                return {
                    id: asset.id,
                    type: asset.type,
                    value: {
                        imageUrl: (0, utils_1.prependCloudinaryBaseUrl)(asset.imageUrl),
                        link: asset.link,
                        pos: asset.pos,
                    },
                };
            }
            else if (asset.type === 'link') {
                return {
                    id: asset.id,
                    type: asset.type,
                    value: { link: asset.link },
                };
            }
            else if (asset.type === 'card') {
                return {
                    id: asset.id,
                    type: asset.type,
                    value: {
                        link: asset.link,
                        imageUrl: asset.imageUrl ? (0, utils_1.prependCloudinaryBaseUrl)(asset.imageUrl) : null,
                        title: asset.title,
                        description: asset.description,
                        pos: asset.pos,
                    },
                };
            }
        });
        return res.json(Object.assign(Object.assign({}, portfolio), { username: user.username, thumbnail: portfolio.thumbnail ? (0, utils_1.prependCloudinaryBaseUrl)(portfolio.thumbnail) : null, isLike, socialLink: {
                blogLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.blogLink,
                linkedinLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.linkedinLink,
                githubLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.githubLink,
                instagramLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.instagramLink,
                facebookLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.facebookLink,
                twitterLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.twitterLink,
                youtubeLink: socialLink === null || socialLink === void 0 ? void 0 : socialLink.youtubeLink,
            }, assets: data }));
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.getPortFolio = getPortFolio;
