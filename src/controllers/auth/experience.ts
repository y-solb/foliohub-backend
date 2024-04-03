import { NextFunction, Request, Response } from 'express';
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';
import { setTokenCookie } from '../../libs/token';
import { CustomError } from '../../libs/customError';

/**
 * 체험 로그인
 * /v1/auth/experience
 */
export const experience = async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body;
  if (!code || code !== 'HelloWorld') {
    res.status(400).json({ message: 'Invalid code' });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        providerId: 'test',
      },
    });

    if (!user) return;

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
