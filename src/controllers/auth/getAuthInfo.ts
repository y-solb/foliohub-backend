import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';

export const getAuthInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user === null) return res.json(null);

    // 로그인 상태
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: req.user.id,
      },
      relations: ['portfolio'],
    });
    if (!user) return next(new CustomError(401, 'Unauthorized', '해당 user가 존재하지 않습니다.'));
    const { portfolio, id, username } = user;

    return res.json({ id, username, thumbnail: portfolio.thumbnail });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
