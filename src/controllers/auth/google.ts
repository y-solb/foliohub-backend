import { google } from "googleapis";
import { Request, Response } from "express";
import { User } from "../../entities/User";
import { AppDataSource } from "../../data-source";
import { generateToken, setTokenCookie } from "../../libs/token";

const REDIRECT_PATH = "/v1/auth/callback/";
const REDIRECT_URI =
  process.env.NODE_ENV === "development"
    ? `http://localhost:3001${REDIRECT_PATH}`
    : `http://localhost:3001${REDIRECT_PATH}`;

const generators = {
  google() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URI}google`
    );
    const url = oauth2Client.generateAuthUrl({
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });

    return url;
  },
};

/**
 * social login
 * GET /v1/auth/redirect/:provider (google)
 */
export const socialRedirect = async (req: Request, res: Response) => {
  const { provider } = req.params;

  if (provider !== "google") {
    res.status(400).send();
    return;
  }

  const loginUrl = generators[provider]();
  res.redirect(loginUrl);
};

/**
 * 구글 redirect uri
 * /v1/auth/callback/google
 */
export const googleCallback = async (req: Request, res: Response) => {
  const { code }: { code?: string } = req.query;
  if (!code) {
    res.status(400).send();
    return;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URI}google`
    );
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens) throw new Error("Failed to retrieve google token");

    oauth2Client.setCredentials(tokens);
    const { data } = await google
      .oauth2("v2")
      .userinfo.get({ auth: oauth2Client });

    if (!data.id) return;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        googleId: data.id,
      },
    });

    // login
    if (user) {
      const { refreshToken } = await user.generateUserToken();
      setTokenCookie(res, refreshToken);
      // res.json({ accessToken });
      res.redirect(`http://localhost:3000`);
      return;
    }

    // register
    const registerToken = generateToken(
      { email: data.email, id: data.id },
      { expiresIn: "1h" }
    );

    res.cookie("registerToken", registerToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
    });

    res.redirect("http://localhost:3000/auth/register");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "문제가 발생했습니다." });
  }
};
