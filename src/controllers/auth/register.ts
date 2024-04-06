import { Request, Response, NextFunction } from 'express';
import { decodeToken, setTokenCookie } from '../../libs/token';
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';
import { CustomError } from '../../libs/customError';
import { Portfolio } from '../../entities/Portfolio';
import { SocialLink } from '../../entities/SocialLink';

/**
 * 회원가입
 * POST /v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, displayName } = req.body;
    const { registerToken } = req.cookies;
    if (!username || !displayName) {
      return next(new CustomError(400, 'Validation', '해당 이름 또는 ID값이 존재하지 않습니다.'));
    }
    if (!registerToken) {
      return next(new CustomError(400, 'General', '회원가입을 처음부터 다시 시도해 주세요.'));
    }
    const userRepository = AppDataSource.getRepository(User);
    const existingUsername = await userRepository.findOne({
      where: {
        username,
      },
    });
    if (existingUsername) {
      return next(new CustomError(400, 'General', '해당 ID을 사용하는 사용자가 존재합니다.'));
    }

    const { email, provider, providerId } = decodeToken(registerToken) as {
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
    portfolio.displayName = displayName;
    await AppDataSource.getRepository(Portfolio).save(portfolio);

    const socialLink = new SocialLink();
    socialLink.userId = user.id;
    await AppDataSource.getRepository(SocialLink).save(socialLink);

    res.clearCookie('registerToken', { domain: process.env.COOKIE_DOMAIN, path: '/' });

    const token = await user.generateUserToken();
    setTokenCookie(res, token);
    res.json('success');
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
