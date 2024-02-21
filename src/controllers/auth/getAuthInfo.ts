import { Request, Response } from 'express';

export const getAuthInfo = (req: Request, res: Response) => {
  return res.json({ currentUser: req.user ?? null });
};
