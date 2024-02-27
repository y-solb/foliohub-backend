import { Request, Response, NextFunction } from 'express';
import { decodeToken, setTokenCookie } from '../../libs/token';
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';
import { CustomError } from '../../libs/customError';
import { Portfolio } from '../../entities/Portfolio';

/**
 * 회원가입
 * GET /v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return next(new CustomError(400, 'Validation', '해당 userId값이 존재하지 않습니다.'));
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUsername = await userRepository.findOne({
      where: {
        userId,
      },
    });
    if (existingUsername) {
      return next(new CustomError(400, 'General', '해당 userId을 사용하는 사용자가 존재합니다.'));
    }

    const { email, provider, providerId } = decodeToken(req.cookies.registerToken) as {
      email: string;
      provider: 'google';
      providerId: string;
    };
    const user = new User();
    user.email = email;
    user.userId = userId;
    user.provider = provider;
    user.providerId = providerId;

    await userRepository.save(user);

    const portfolio = new Portfolio();
    portfolio.fkUserId = user.id;
    await AppDataSource.getRepository(Portfolio).save(portfolio);

    res.clearCookie('registerToken');

    const { refreshToken } = await user.generateUserToken();
    setTokenCookie(res, refreshToken);
    res.json('success');
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
