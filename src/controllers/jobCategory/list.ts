import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { JobCategory } from '../../entities/JobCategory';

type CategorizedCategory = {
  code: string;
  name: string;
  sub: { code: string; name: string }[];
};

function categorizeJobCategories(categories: JobCategory[]) {
  const categorizedCategories: { [key: string]: CategorizedCategory } = {};

  categories.forEach((category) => {
    const { code, name } = category;
    const mainCategoryCode = code.slice(0, 2);

    if (!categorizedCategories[mainCategoryCode]) {
      categorizedCategories[mainCategoryCode] = {
        code: mainCategoryCode,
        name: '',
        sub: [],
      };
    }
    if (code.length === 2) {
      return (categorizedCategories[mainCategoryCode].name = name);
    }

    const mainCategory = categorizedCategories[mainCategoryCode];
    mainCategory.sub.push({
      code,
      name,
    });
  });

  return Object.values(categorizedCategories);
}

export const listJobCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobCategories = await AppDataSource.getRepository(JobCategory).find({
      where: {
        isActive: true,
      },
      select: ['code', 'name'],
    });

    return res.json(categorizeJobCategories(jobCategories));
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
