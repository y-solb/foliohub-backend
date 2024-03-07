import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';

export const editJobCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user;
  if (!id) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }

  const { jobCode } = req.body;
  if (!jobCode) {
    return next(new CustomError(400, 'Validation', '해당 jobCode값이 존재하지 않습니다.'));
  }
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return next(new CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
    }

    user.jobCategoryCode = jobCode;
    await userRepository.save(user);

    return res.json({ success: true, message: '직업이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
