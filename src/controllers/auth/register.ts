import { Request, Response } from "express";
import { decodeToken, setTokenCookie } from "../../libs/token";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";

/**
 * 회원가입
 * GET /v1/auth/register
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username) return; // TODO: error 처리

    const userRepository = AppDataSource.getRepository(User);
    const existingUsername = await userRepository.findOne({
      where: {
        username,
      },
    });
    if (existingUsername) throw new Error("이미 사용중인 사용자가 있음!"); // TODO: error 처리

    const { email, id } = decodeToken(req.cookies.registerToken) as {
      email: string;
      id: string;
    };
    const user = new User();

    user.email = email;
    user.username = username;
    user.google_id = id;

    await userRepository.save(user);
    res.clearCookie("registerToken");

    const { refreshToken } = await user.generateUserToken();
    setTokenCookie(res, refreshToken);
    res.json("success");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
