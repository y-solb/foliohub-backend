import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { Portfolio } from '../../entities/Portfolio';
import { Asset } from '../../entities/Asset';
import { SocialLink } from '../../entities/SocialLink';
import { extractImagePath } from '../../libs/utils';

/**
 * 포트폴리오 수정
 * PUT /v1/portfolio/:username
 */

export const editPortFolio = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }

  const { username } = req.params;
  const {
    displayName,
    shortBio,
    thumbnail,
    assets,
    layout,
    socialLink: {
      blogLink,
      linkedinLink,
      facebookLink,
      githubLink,
      instagramLink,
      twitterLink,
      youtubeLink,
    },
  } = req.body;
  if (username !== req.user.username) {
    return next(new CustomError(403, 'Forbidden', '해당 api에 접근 권한이 없습니다.'));
  }

  try {
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: {
        userId: req.user.id,
      },
    });

    if (!portfolio) {
      return next(new CustomError(404, 'General', '해당 portfolio가 존재하지 않습니다.'));
    }

    portfolio.displayName = displayName;
    portfolio.shortBio = shortBio;
    portfolio.thumbnail = thumbnail ? extractImagePath(thumbnail) : '';
    portfolio.layout = layout;
    await portfolioRepository.save(portfolio);

    const socialLinkRepository = AppDataSource.getRepository(SocialLink);
    const socialLink = await socialLinkRepository.findOne({
      where: {
        userId: req.user.id,
      },
    });
    if (!socialLink) {
      return next(new CustomError(404, 'General', '해당 socialLink가 존재하지 않습니다.'));
    }

    socialLink.blogLink = blogLink;
    socialLink.linkedinLink = linkedinLink;
    socialLink.facebookLink = facebookLink;
    socialLink.githubLink = githubLink;
    socialLink.instagramLink = instagramLink;
    socialLink.twitterLink = twitterLink;
    socialLink.youtubeLink = youtubeLink;
    await socialLinkRepository.save(socialLink);

    const assetRepository = AppDataSource.getRepository(Asset);

    for (const asset of assets) {
      // update asset
      if (asset.command === 'update') {
        const existingAsset = await assetRepository.findOne({
          where: {
            id: asset.id,
          },
        });
        if (!existingAsset) {
          return next(new CustomError(404, 'General', '해당 asset이 존재하지 않습니다.'));
        }

        if (asset.type === 'github') {
          existingAsset.githubId = asset.value.githubId;
        } else if (asset.type === 'image') {
          existingAsset.link = asset.value.link;
          existingAsset.imageUrl = extractImagePath(asset.value.imageUrl);
          existingAsset.pos = asset.value.pos;
        } else if (asset.type === 'content') {
          existingAsset.content = asset.value.content;
        } else if (asset.type === 'card') {
          existingAsset.link = asset.value.link;
          existingAsset.imageUrl = asset.value.imageUrl
            ? extractImagePath(asset.value.imageUrl)
            : '';
          existingAsset.title = asset.value.title;
          existingAsset.description = asset.value.description;
          existingAsset.pos = asset.value.pos;
        }
        await assetRepository.save(existingAsset);
        continue;
      }

      // delete asset
      if (asset.command === 'delete') {
        const existingAsset = await assetRepository.findOne({
          where: {
            id: asset.id,
          },
        });
        if (!existingAsset) {
          return next(new CustomError(404, 'General', '해당 asset이 존재하지 않습니다.'));
        }

        existingAsset.status = false;
        await assetRepository.save(existingAsset);
        continue;
      }

      // create asset
      if (asset.command === 'save') {
        const newAsset = new Asset();
        newAsset.layoutId = asset.layoutId;
        newAsset.portfolioId = portfolio.id;
        newAsset.type = asset.type;
        if (asset.type === 'github') {
          newAsset.githubId = asset.value.githubId;
        } else if (asset.type === 'image') {
          newAsset.link = asset.value.link;
          newAsset.imageUrl = extractImagePath(asset.value.imageUrl);
          newAsset.pos = asset.value.pos;
        } else if (asset.type === 'content') {
          newAsset.content = asset.value.content;
        } else if (asset.type === 'card') {
          newAsset.link = asset.value.link;
          newAsset.imageUrl = asset.value.imageUrl ? extractImagePath(asset.value.imageUrl) : '';
          newAsset.title = asset.value.title;
          newAsset.description = asset.value.description;
          newAsset.pos = asset.value.pos;
        }
        await assetRepository.save(newAsset);
      }
    }
    return res.json({ success: true, message: '포트폴리오가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
