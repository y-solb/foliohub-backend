import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';

/**
 * 로그아웃
 * POST /v1/auth/logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: AuthToken에서 삭제해야 하는지
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json('success');
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
