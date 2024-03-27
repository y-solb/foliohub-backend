import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';
import { AppDataSource } from '../../data-source';
import { User } from '../../entities/User';
import { Portfolio } from '../../entities/Portfolio';
import { prependCloudinaryBaseUrl } from '../../libs/utils';

export const metadataPortfolio = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.query;

  if (typeof username !== 'string')
    return next(new CustomError(400, 'General', 'username이 string 타입이 아닙니다.'));

  try {
    const UserRepository = AppDataSource.getRepository(User);
    const user = await UserRepository.findOne({
      where: {
        username: username,
      },
      select: ['id'],
    });
    if (!user) {
      return next(new CustomError(400, 'General', '해당 user가 존재하지 않습니다.'));
    }
    const portfolioRepository = AppDataSource.getRepository(Portfolio);
    const portfolio = await portfolioRepository.findOne({
      where: {
        userId: user.id,
      },
      select: ['thumbnail', 'displayName', 'shortBio'],
    });

    return res.json({
      thumbnail: portfolio?.thumbnail ? prependCloudinaryBaseUrl(portfolio.thumbnail) : null,
      displayName: portfolio?.displayName ?? null,
      shortBio: portfolio?.shortBio ?? null,
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
