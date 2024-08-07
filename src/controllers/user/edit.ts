import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { Portfolio } from '../../entities/Portfolio';

/**
 * 직업 카테고리 수정
 * PUT /v1/user/job-category
 */
export const editJobCategory = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }

  const { id } = req.user;
  if (!id) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }

  const { jobCode } = req.body;
  if (!jobCode) {
    return next(new CustomError(400, 'Validation', '해당 jobCode값이 존재하지 않습니다.'));
  }
  try {
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({ where: { userId: id } });

    if (!portfolio) {
      return next(new CustomError(404, 'General', '해당 portfolio가 존재하지 않습니다.'));
    }

    portfolio.jobCategoryCode = jobCode;
    await portfolioRepository.save(portfolio);

    return res.json({ success: true, message: '직업이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
