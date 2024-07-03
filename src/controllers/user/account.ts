import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';
import { Portfolio } from '../../entities/Portfolio';
import { SocialLink } from '../../entities/SocialLink';
import { Asset } from '../../entities/Asset';
import { LikePortfolio } from '../../entities/LikePortfolio';
import AuthToken from '../../entities/AuthToken';

/**
 * 탈퇴
 * DELETE /v1/user/account
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }

  const { id } = req.user;

  try {
    // SocialLink 삭제
    const socialLinkRepository = AppDataSource.getRepository(SocialLink);
    await socialLinkRepository.delete({
      userId: id,
    });

    // AuthToken 삭제
    const authTokenRepository = AppDataSource.getRepository(AuthToken);
    await authTokenRepository.delete({
      userId: id,
    });

    // Portfolio
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: {
        userId: id,
      },
    });

    if (!portfolio) {
      return next(new CustomError(404, 'General', '해당 portfolio가 존재하지 않습니다.'));
    }

    // Asset 삭제
    const assetRepository = AppDataSource.getRepository(Asset);
    await assetRepository.delete({
      portfolioId: portfolio.id,
    });

    // LikePortfolio
    const likePortFolioRepository = AppDataSource.getRepository(LikePortfolio);

    // 탈퇴한 사용자의 좋아요 기록을 익명화, userId는 null 처리
    const likeList = await likePortFolioRepository.find({
      where: {
        userId: id,
      },
    });
    const updatedLikeList = likeList.map((like) => ({ ...like, userId: null }));
    await likePortFolioRepository.save(updatedLikeList);

    // 탈퇴한 사용자가 작성한 포트폴리오에 대한 모든 좋아요 기록 삭제
    await likePortFolioRepository.delete({
      portfolioId: portfolio.id,
    });

    // Portfolio 삭제
    await portfolioRepository.delete({
      userId: id,
    });

    // User 삭제
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete({
      id,
    });

    res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
    res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
    return res.json({
      message: '다음에 다시 만나요!',
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
