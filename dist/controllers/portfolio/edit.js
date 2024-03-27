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
exports.editPortFolio = void 0;
const customError_1 = require("../../libs/customError");
const data_source_1 = require("../../data-source");
const Portfolio_1 = require("../../entities/Portfolio");
const Asset_1 = require("../../entities/Asset");
const SocialLink_1 = require("../../entities/SocialLink");
const utils_1 = require("../../libs/utils");
const editPortFolio = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }
    const { username } = req.params;
    const { displayName, shortBio, thumbnail, assets, layout, socialLink: { blogLink, linkedinLink, facebookLink, githubLink, instagramLink, twitterLink, youtubeLink, }, } = req.body;
    if (username !== req.user.username) {
        return next(new customError_1.CustomError(401, 'Unauthorized', '해당 페이지에 접근 권한이 없습니다.'));
    }
    try {
        const portfolioRepository = data_source_1.AppDataSource.getRepository(Portfolio_1.Portfolio);
        const portfolio = yield portfolioRepository.findOne({
            where: {
                userId: req.user.id,
            },
        });
        if (!portfolio) {
            return next(new customError_1.CustomError(400, 'General', '해당 portfolio가 존재하지 않습니다.'));
        }
        portfolio.displayName = displayName;
        portfolio.shortBio = shortBio;
        portfolio.thumbnail = thumbnail ? (0, utils_1.extractImagePath)(thumbnail) : '';
        portfolio.layout = layout;
        yield portfolioRepository.save(portfolio);
        const socialLinkRepository = data_source_1.AppDataSource.getRepository(SocialLink_1.SocialLink);
        const socialLink = yield socialLinkRepository.findOne({
            where: {
                userId: req.user.id,
            },
        });
        if (!socialLink) {
            return next(new customError_1.CustomError(400, 'General', '해당 socialLink가 존재하지 않습니다.'));
        }
        socialLink.blogLink = blogLink;
        socialLink.linkedinLink = linkedinLink;
        socialLink.facebookLink = facebookLink;
        socialLink.githubLink = githubLink;
        socialLink.instagramLink = instagramLink;
        socialLink.twitterLink = twitterLink;
        socialLink.youtubeLink = youtubeLink;
        yield socialLinkRepository.save(socialLink);
        const assetRepository = data_source_1.AppDataSource.getRepository(Asset_1.Asset);
        for (const asset of assets) {
            // update asset
            if (asset.command === 'update') {
                const existingAsset = yield assetRepository.findOne({
                    where: {
                        id: asset.id,
                    },
                });
                if (!existingAsset) {
                    return next(new customError_1.CustomError(400, 'General', '해당 asset이 존재하지 않습니다.'));
                }
                if (asset.type === 'github') {
                    existingAsset.githubId = asset.value.githubId;
                }
                else if (asset.type === 'link') {
                    existingAsset.link = asset.value.link;
                }
                else if (asset.type === 'image') {
                    existingAsset.link = asset.value.link;
                    existingAsset.imageUrl = (0, utils_1.extractImagePath)(asset.value.imageUrl);
                    existingAsset.pos = asset.value.pos;
                }
                else if (asset.type === 'content') {
                    existingAsset.content = asset.value.content;
                }
                yield assetRepository.save(existingAsset);
                continue;
            }
            // delete asset
            if (asset.command === 'delete') {
                const existingAsset = yield assetRepository.findOne({
                    where: {
                        id: asset.id,
                    },
                });
                if (!existingAsset) {
                    return next(new customError_1.CustomError(400, 'General', '해당 asset이 존재하지 않습니다.'));
                }
                existingAsset.status = false;
                yield assetRepository.save(existingAsset);
                continue;
            }
            // create asset
            if (asset.command === 'save') {
                const newAsset = new Asset_1.Asset();
                newAsset.layoutId = asset.id;
                newAsset.userId = req.user.id;
                newAsset.portfolioId = portfolio.id;
                newAsset.type = asset.type;
                if (asset.type === 'github') {
                    newAsset.githubId = asset.value.githubId;
                }
                else if (asset.type === 'link') {
                    newAsset.link = asset.value.link;
                }
                else if (asset.type === 'image') {
                    newAsset.link = asset.value.link;
                    newAsset.imageUrl = (0, utils_1.extractImagePath)(asset.value.imageUrl);
                }
                else if (asset.type === 'content') {
                    newAsset.content = asset.value.content;
                }
                yield assetRepository.save(newAsset);
            }
        }
        return res.json({ success: true, message: '포트폴리오가 성공적으로 업데이트되었습니다.' });
    }
    catch (error) {
        return next(new customError_1.CustomError(400, 'Raw', 'Error', null, error));
    }
});
exports.editPortFolio = editPortFolio;
