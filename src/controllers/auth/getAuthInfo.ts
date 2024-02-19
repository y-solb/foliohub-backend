import { Request, Response } from "express";

export const getAuthInfo = async (req: Request, res: Response) => {
  return res.json({ currentUser: req.user ?? null });
};
