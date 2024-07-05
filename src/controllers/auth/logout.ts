import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import AuthToken from '../../entities/AuthToken';

/**
 * 로그아웃
 * POST /v1/auth/logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(new CustomError(401, 'Unauthorized', 'refreshToken이 존재하지 않습니다.'));
    }

    const authTokenRepository = AppDataSource.getRepository(AuthToken);
    await authTokenRepository.delete({
      token: refreshToken,
    });

    res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
    res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });

    return res.json({
      success: true,
      message: '로그아웃 처리 되었습니다.',
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
