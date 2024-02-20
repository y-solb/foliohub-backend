import { Request, Response, NextFunction } from "express";
import { User } from "../entities/User";
import { decodeToken, generateToken } from "../libs/token";
import { AppDataSource } from "../data-source";
import AuthToken from "../entities/AuthToken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
      if (!refreshToken) return next();

      const authTokenRepository = AppDataSource.getRepository(AuthToken);
      const authToken = await authTokenRepository.findOne({
        where: {
          token: refreshToken,
        },
      });
      if (!authToken) throw new Error("Unauthenticated");

      const accessToken = generateToken(
        {
          userId: authToken.fkUserId,
        },
        {
          subject: "access_token",
          expiresIn: "1h",
        }
      );

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: {
          id: authToken.fkUserId,
        },
      });
      if (!user) throw new Error("Unauthenticated");

      req.user = { ...user, accessToken };

      return next();
    }

    const { userId } = decodeToken(accessToken) as { userId: string };

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("Unauthenticated");

    req.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
};
