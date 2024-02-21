import { Request, Response } from 'express';
import { CustomError } from '../libs/customError';

const errorHandler = (error: CustomError, req: Request, res: Response) => {
  return res.status(error.HttpStatusCode).json(error.JSON);
};

export default errorHandler;
