import { Request, Response, NextFunction } from 'express';
import { generateToken, setAccessTokenCookie } from '../../libs/token';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import AuthToken from '../../entities/AuthToken';

/**
 * accessToken 재발급
 * POST /v1/auth/refresh
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new CustomError(401, 'Unauthorized', 'refreshToken이 존재하지 않습니다.'));
  }

  try {
    const authTokenRepository = AppDataSource.getRepository(AuthToken);
    const authToken = await authTokenRepository.findOne({
      where: {
        token: refreshToken,
      },
    });

    if (!authToken) {
      return next(new CustomError(401, 'Unauthorized', '해당 token이 존재하지 않습니다.'));
    }
    const currentTimestamp = new Date().getTime();
    if (authToken.expiresAt.getTime() <= currentTimestamp) {
      res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
      res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
      return res.json({ message: 'token이 만료되었습니다. 다시 로그인해주세요.' });
    }
    const accessToken = generateToken(
      {
        userId: authToken.userId,
      },
      {
        subject: 'access_token',
        expiresIn: '1h',
      }
    );

    setAccessTokenCookie(res, accessToken);

    return res.json({
      success: true,
      message: 'accessToken이 재발급되었습니다.',
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
