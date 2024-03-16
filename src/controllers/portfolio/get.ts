import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { Portfolio } from '../../entities/Portfolio';
import { Asset } from '../../entities/Asset';
import { User } from '../../entities/User';
import { LikePortfolio } from '../../entities/LikePortfolio';
import { SocialLink } from '../../entities/SocialLink';

export const getPortFolio = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;

  try {
    const UserRepository = AppDataSource.getRepository(User);
    const user = await UserRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      return next(new CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
    }
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!portfolio) {
      return next(new CustomError(400, 'General', '해당 portfolio가 존재하지 않습니다.'));
    }

    let isLike = false;
    if (req.user) {
      const LikePortfolioRepository = AppDataSource.getRepository(LikePortfolio);
      const like = await LikePortfolioRepository.findOne({
        where: { portfolioId: portfolio.id, userId: req.user.id, status: true },
      });
      if (like) {
        isLike = true;
      }
    }

    const socialLinkRepository = AppDataSource.getRepository(SocialLink);
    const socialLink = await socialLinkRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    const assetRepository = AppDataSource.getRepository(Asset);
    const assets = await assetRepository.find({
      where: {
        userId: user.id,
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
      } else if (asset.type === 'content') {
        return {
          id: asset.id,
          type: asset.type,
          value: { content: asset.content },
        };
      } else if (asset.type === 'image') {
        return {
          id: asset.id,
          type: asset.type,
          value: { imageUrl: asset.imageUrl, link: asset.link, pos: asset.pos },
        };
      } else if (asset.type === 'link') {
        return {
          id: asset.id,
          type: asset.type,
          value: { link: asset.link },
        };
      }
    });

    return res.json({
      username: user.username,
      ...portfolio,
      isLike,
      socialLink: {
        blogLink: socialLink?.blogLink,
        linkedinLink: socialLink?.linkedinLink,
        githubLink: socialLink?.githubLink,
        instagramLink: socialLink?.instagramLink,
        facebookLink: socialLink?.facebookLink,
        twitterLink: socialLink?.twitterLink,
        youtubeLink: socialLink?.youtubeLink,
      },
      assets: data,
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
