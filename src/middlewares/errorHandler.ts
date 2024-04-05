import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../libs/customError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  return res.status(error.HttpStatusCode).json(error.JSON);
};

export default errorHandler;
