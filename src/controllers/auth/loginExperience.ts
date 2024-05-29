import { NextFunction, Request, Response } from 'express';
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';
import { setTokenCookie } from '../../libs/token';
import { CustomError } from '../../libs/customError';

/**
 * 체험 로그인
 * POST /v1/auth/loginExperience
 */
export const loginExperience = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body;
  if (!code || code !== 'HelloWorld') {
    return next(new CustomError(400, 'General', '타당하지 않은 code입니다.'));
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        providerId: 'test',
      },
    });

    if (!user) {
      return next(new CustomError(404, 'General', '해당 user가 존재하지 않습니다.'));
    }

    const token = await user.generateUserToken();
    setTokenCookie(res, token);
    return res.json({
      success: true,
      message: '체험 로그인이 완료되었습니다.',
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
