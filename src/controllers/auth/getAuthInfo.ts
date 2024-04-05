import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';
import { prependCloudinaryBaseUrl } from '../../libs/utils';

/**
 * 유저 정보 확인
 * GET /v1/auth
 */
export const getAuthInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user === null) {
      return res.json(null);
    }

    // 로그인 상태
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: req.user.id,
      },
      relations: ['portfolio'],
    });
    if (!user) {
      return next(new CustomError(404, 'General', '해당 user가 존재하지 않습니다.'));
    }

    const { portfolio, id, username } = user;

    return res.json({
      id,
      username,
      thumbnail: portfolio.thumbnail ? prependCloudinaryBaseUrl(portfolio.thumbnail) : null,
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
