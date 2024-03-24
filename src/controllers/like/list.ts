import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { LikePortfolio } from '../../entities/LikePortfolio';
import { JobCategory } from '../../entities/JobCategory';
import { User } from '../../entities/User';

export const listLike = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new CustomError(401, 'Unauthorized', '해당 api에 접근 권한이 없습니다.'));
  }
  const { id } = req.user;

  const currentPage: number = Number(req.query.page) || 0;
  const perPage: number = Number(req.query.count) || 10;

  if (currentPage < 0) {
    return next(
      new CustomError(
        400,
        'General',
        '잘못된 페이지 값입니다. 페이지 값은 0 이상의 정수여야 합니다.'
      )
    );
  }
  try {
    const [portfolios, total] = await AppDataSource.getRepository(LikePortfolio).findAndCount({
      order: { updatedAt: 'DESC' },
      select: ['id', 'portfolioId', 'userId', 'status', 'updatedAt'],
      where: {
        status: true,
        userId: id,
      },
      relations: ['portfolio'],
      skip: (currentPage - 1) * perPage,
      take: perPage,
    });
    const portfolioList = await Promise.all(
      portfolios.map(async (p) => {
        const {
          portfolio: { id, displayName, shortBio, thumbnail, likeCount, userId, jobCategoryCode },
        } = p;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: {
            id: userId,
          },
          select: ['username'],
        });
        if (!user) return;

        const jobCategoryRepository = AppDataSource.getRepository(JobCategory);
        const jobCategory = await jobCategoryRepository.findOne({
          where: {
            code: jobCategoryCode,
          },
          select: ['name'],
        });

        return {
          username: user.username,
          userJob: jobCategory ? jobCategory.name : null,
          id,
          displayName,
          shortBio,
          thumbnail,
          likeCount,
          userId,
        };
      })
    );

    const lastPage = Math.ceil(total / perPage);
    return res.json({
      data: portfolioList,
      meta: {
        total,
        currentPage,
        lastPage,
        hasNextPage: total > 0 && currentPage < lastPage,
      },
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
