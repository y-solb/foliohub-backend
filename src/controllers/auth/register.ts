import { Request, Response, NextFunction } from 'express';
import { decodeToken, setTokenCookie } from '../../libs/token';
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';
import { CustomError } from '../../libs/customError';
import { Portfolio } from '../../entities/Portfolio';
import { SocialLink } from '../../entities/SocialLink';

/**
 * 회원가입
 * GET /v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;

    if (!username) {
      return next(new CustomError(400, 'Validation', '해당 username값이 존재하지 않습니다.'));
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUsername = await userRepository.findOne({
      where: {
        username,
      },
    });
    if (existingUsername) {
      return next(new CustomError(400, 'General', '해당 username을 사용하는 사용자가 존재합니다.'));
    }

    const { email, provider, providerId } = decodeToken(req.cookies.registerToken) as {
      email: string;
      provider: 'google';
      providerId: string;
    };
    const user = new User();
    user.email = email;
    user.username = username;
    user.provider = provider;
    user.providerId = providerId;

    await userRepository.save(user);

    const portfolio = new Portfolio();
    portfolio.userId = user.id;
    await AppDataSource.getRepository(Portfolio).save(portfolio);

    const socialLink = new SocialLink();
    socialLink.userId = user.id;
    await AppDataSource.getRepository(SocialLink).save(socialLink);

    res.clearCookie('registerToken');

    const token = await user.generateUserToken();
    setTokenCookie(res, token);
    res.json('success');
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
