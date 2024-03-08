import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { LikePortfolio } from '../../entities/LikePortfolio';

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
      return res.json({
        success: true,
        message: '좋아요가 성공적으로 업데이트되었습니다.',
        isLike: true,
      });
    }

    const newLike = new LikePortfolio();
    newLike.fkPortfolioId = portfolioId;
    newLike.fkUserId = id;
    newLike.status = true;

    await likePortFolioRepository.save(newLike);

    return res.json({
      success: true,
      message: '좋아요가 성공적으로 업데이트되었습니다.',
      isLike: true,
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
    if (existingLike) {
      existingLike.status = false;
      await likePortFolioRepository.save(existingLike);
      return res.json({
        success: true,
        message: '좋아요가 성공적으로 업데이트되었습니다.',
        isLike: false,
      });
    }
    return next(new CustomError(400, 'Validation', '해당 값이 존재하지 않습니다.'));
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
