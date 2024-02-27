import axios from 'axios';
import * as cheerio from 'cheerio';
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../libs/customError';

export const extractUrlMetadata = async (req: Request, res: Response, next: NextFunction) => {
  const { link } = req.query;

  if (typeof link !== 'string')
    return next(new CustomError(400, 'General', 'link이 string 타입이 아닙니다.'));

  try {
    const response = await axios.get(link);
    const html = response.data;

    const $ = cheerio.load(html);
    const metadata = {
      url: $('meta[property="og:url"]').attr('content'),
      title: $('meta[property="og:title"]').attr('content') || $('title').text(),
      description:
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="description"]').attr('content'),
      image: $('meta[property="og:image"]').attr('content'),
    };

    res.json(metadata);
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
