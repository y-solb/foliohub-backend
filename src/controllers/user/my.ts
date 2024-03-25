import { JobCategory } from './../../entities/JobCategory';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';
import { Portfolio } from '../../entities/Portfolio';

export const my = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }

  const { id } = req.user;

  try {
    const UserRepository = AppDataSource.getRepository(User);
    const user = await UserRepository.findOne({
      where: {
        id,
      },
      select: ['id', 'username'],
    });
    if (!user) {
      return next(new CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
    }
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: {
        userId: user.id,
      },
      select: ['displayName', 'thumbnail', 'jobCategoryCode'],
    });

    if (!portfolio) {
      return next(new CustomError(400, 'General', '해당 portfolio가 존재하지 않습니다.'));
    }
    if (!portfolio.jobCategoryCode) {
      return res.json({
        ...user,
        ...portfolio,
        job: null,
        jobCode: null,
      });
    }
    const JobCategoryRepository = AppDataSource.getRepository(JobCategory);
    const jobCategory = await JobCategoryRepository.findOne({
      where: {
        code: portfolio.jobCategoryCode,
      },
      select: ['code', 'name'],
    });
    return res.json({ ...user, ...portfolio, job: jobCategory?.name, jobCode: jobCategory?.code });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
