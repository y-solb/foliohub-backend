import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import { decodeToken, generateToken } from '../libs/token';
import { AppDataSource } from '../data-source';
import AuthToken from '../entities/AuthToken';
import { CustomError } from '../libs/customError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      if (!refreshToken) return next();

      const authTokenRepository = AppDataSource.getRepository(AuthToken);
      const authToken = await authTokenRepository.findOne({
        where: {
          token: refreshToken,
        },
      });
      if (!authToken)
        return next(new CustomError(401, 'Unauthorized', '해당 token이 존재하지 않습니다.'));

      const accessToken = generateToken(
        {
          userId: authToken.fkUserId,
        },
        {
          subject: 'access_token',
          expiresIn: '1h',
        }
      );

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          id: authToken.fkUserId,
        },
      });
      if (!user)
        return next(new CustomError(401, 'Unauthorized', '해당 user가 존재하지 않습니다.'));

      req.user = { ...user, accessToken };

      return next();
    }

    const { userId } = decodeToken(accessToken) as { userId: string };

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) return next(new CustomError(401, 'Unauthorized', '해당 user가 존재하지 않습니다.'));

    req.user = user;
    return next();
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
