import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { LikePortfolio } from '../../entities/LikePortfolio';
import { Portfolio } from '../../entities/Portfolio';

export const likePortfolio = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  if (!id) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }
  const { portfolioId } = req.params;
  if (!portfolioId) {
    return next(new CustomError(400, 'Validation', '해당 portfolioId값이 존재하지 않습니다.'));
  }

  try {
    const likePortFolioRepository = AppDataSource.getRepository(LikePortfolio);
    const existingLike = await likePortFolioRepository.findOne({
      where: { fkPortfolioId: portfolioId, fkUserId: id },
    });
    if (existingLike) {
      existingLike.status = true;

      await likePortFolioRepository.save(existingLike);
    } else {
      const newLike = new LikePortfolio();
      newLike.fkPortfolioId = portfolioId;
      newLike.fkUserId = id;
      newLike.status = true;

      await likePortFolioRepository.save(newLike);
    }

    const portFolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portFolioRepository.findOne({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      return next(new CustomError(400, 'Validation', '해당 portfolioId값이 존재하지 않습니다.'));
    }
    portfolio.likeCount = portfolio.likeCount + 1;
    await portFolioRepository.save(portfolio);

    return res.json({
      success: true,
      message: '좋아요가 성공적으로 업데이트되었습니다.',
      isLike: true,
      likeCount: portfolio.likeCount,
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};

export const unlikePortfolio = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  if (!id) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }
  const { portfolioId } = req.params;
  if (!portfolioId) {
    return next(new CustomError(400, 'Validation', '해당 portfolioId값이 존재하지 않습니다.'));
  }

  try {
    const likePortFolioRepository = AppDataSource.getRepository(LikePortfolio);
    const existingLike = await likePortFolioRepository.findOne({
      where: { fkPortfolioId: portfolioId, fkUserId: id },
    });
    if (!existingLike) {
      return next(new CustomError(400, 'Validation', '해당 값이 존재하지 않습니다.'));
    }

    existingLike.status = false;
    await likePortFolioRepository.save(existingLike);

    const portFolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portFolioRepository.findOne({
      where: { id: portfolioId },
    });

    if (!portfolio) {
      return next(new CustomError(400, 'Validation', '해당 portfolioId값이 존재하지 않습니다.'));
    }
    portfolio.likeCount = portfolio.likeCount - 1;
    await portFolioRepository.save(portfolio);

    return res.json({
      success: true,
      message: '좋아요가 성공적으로 업데이트되었습니다.',
      isLike: false,
      likeCount: portfolio.likeCount,
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
