import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { Portfolio } from '../../entities/Portfolio';
import { Asset } from '../../entities/Asset';

export const editPortFolio = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { displayName, shortBio, thumbnail, assets, layout } = req.body;
  if (userId !== req.user.userId) {
    return next(new CustomError(401, 'Unauthorized', '해당 페이지에 접근 권한이 없습니다.'));
  }

  try {
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: {
        fkUserId: req.user.id,
      },
    });

    if (!portfolio) {
      return next(new CustomError(400, 'General', '해당 portfolio가 존재하지 않습니다.'));
    }

    portfolio.displayName = displayName;
    portfolio.shortBio = shortBio;
    portfolio.thumbnail = thumbnail;
    portfolio.layout = layout;

    await portfolioRepository.save(portfolio);

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
          return next(new CustomError(400, 'General', '해당 asset이 존재하지 않습니다.'));
        }

        if (asset.type === 'github') {
          existingAsset.githubId = asset.value.githubId;
        } else if (asset.type === 'link') {
          existingAsset.link = asset.value.link;
        } else if (asset.type === 'image') {
          existingAsset.link = asset.value.link;
          existingAsset.imageUrl = asset.value.imageUrl;
          existingAsset.pos = asset.value.pos;
        } else if (asset.type === 'content') {
          existingAsset.content = asset.value.content;
        }
        await assetRepository.save(existingAsset);
        continue;
      }

      // create asset
      if (asset.command === 'save') {
        const newAsset = new Asset();
        newAsset.layoutId = asset.id;
        newAsset.fkUserId = req.user.id;
        newAsset.fkPortfolioId = portfolio.id;
        newAsset.type = asset.type;
        if (asset.type === 'github') {
          newAsset.githubId = asset.value.githubId;
        } else if (asset.type === 'link') {
          newAsset.link = asset.value.link;
        } else if (asset.type === 'image') {
          newAsset.link = asset.value.link;
          newAsset.imageUrl = asset.value.imageUrl;
        } else if (asset.type === 'content') {
          newAsset.content = asset.value.content;
        }
        await assetRepository.save(newAsset);
      }
    }
    return res.json({ success: true, message: '포트폴리오가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};