import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { decodeToken } from '../libs/token';
import { AppDataSource } from '../data-source';
import { CustomError } from '../libs/customError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) {
      req.user = null;
      return next();
    }

    if (!refreshToken) {
      res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
      res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });
      req.user = null;
      return next();
    }

    if (!accessToken) {
      return next(new CustomError(401, 'Unauthorized', '유효하지 않은 accessToken입니다.'));
    }

    const { userId } = decodeToken(accessToken) as { userId: string };

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) return next(new CustomError(401, 'Unauthorized', '해당 user가 존재하지 않습니다.'));
    const { id, username } = user;
    req.user = { id, username };

    return next();
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
