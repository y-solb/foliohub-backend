import { Request, Response } from 'express';

export const getAuthInfo = (req: Request, res: Response) => {
  return res.json(req.user ?? null);
};
