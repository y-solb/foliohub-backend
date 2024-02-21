import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../libs/customError';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.HttpStatusCode).json(err.JSON);
};

export default errorHandler;
