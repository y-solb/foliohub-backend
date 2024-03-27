import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { Portfolio } from '../../entities/Portfolio';
import { prependCloudinaryBaseUrl } from '../../libs/utils';

export const listPortFolio = async (req: Request, res: Response, next: NextFunction) => {
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
    const [portfolios, total] = await AppDataSource.getRepository(Portfolio).findAndCount({
      order: { updatedAt: 'DESC' },
      select: ['id', 'displayName', 'shortBio', 'thumbnail', 'likeCount', 'userId', 'updatedAt'],
      relations: ['user', 'jobCategory'],
      skip: (currentPage - 1) * perPage,
      take: perPage,
    });

    const lastPage = Math.ceil(total / perPage);
    return res.json({
      data: portfolios.map((portfolio) => {
        const { user, jobCategory, thumbnail, ...rest } = portfolio;
        return {
          ...rest,
          username: user.username,
          thumbnail: thumbnail ? prependCloudinaryBaseUrl(thumbnail) : null,
          userJob: jobCategory ? jobCategory.name : null,
        };
      }),
      meta: {
        total,
        currentPage,
        lastPage,
        hasNextPage: total > 0 && currentPage < lastPage,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
