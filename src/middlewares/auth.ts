import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../libs/customError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
    }

    return next();
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
