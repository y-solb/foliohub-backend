import { google } from 'googleapis';
import { NextFunction, Request, Response } from 'express';
import { User } from '../../entities/User';
import { AppDataSource } from '../../data-source';
import { generateToken, setTokenCookie } from '../../libs/token';
import { CustomError } from '../../libs/customError';

const REDIRECT_PATH = '/v1/auth/callback/';
const REDIRECT_URI = `${process.env.APP_URL}${REDIRECT_PATH}`;

const generators = {
  google() {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URI}google`
    );
    const url = oauth2Client.generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });

    return url;
  },
};

/**
 * social login
 * GET /v1/auth/redirect/:provider (google)
 */
export const socialRedirect = (req: Request, res: Response, next: NextFunction) => {
  const { provider } = req.params;

  if (provider !== 'google') {
    return next(new CustomError(400, 'General', '해당 provider는 존재하지 않습니다.'));
  }

  const loginUrl = generators[provider]();
  res.redirect(loginUrl);
};

/**
 * 구글 redirect uri
 * GET /v1/auth/callback/google
 */
export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  const { code }: { code?: string } = req.query;
  if (!code) {
    return next(new CustomError(400, 'General', '해당 google code가 존재하지 않습니다.'));
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${REDIRECT_URI}google`
    );
    const { tokens } = await oauth2Client.getToken(code);
    if (!tokens) {
      return next(new CustomError(400, 'General', '해당 google token이 존재하지 않습니다.'));
    }

    oauth2Client.setCredentials(tokens);
    const { data } = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });

    if (!data.id) return;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        providerId: data.id,
      },
    });

    // login
    if (user) {
      const token = await user.generateUserToken();
      setTokenCookie(res, token);
      res.redirect(`${process.env.ORIGIN}`);
      return;
    }

    // register
    const registerToken = generateToken(
      { email: data.email, provider: 'google', providerId: data.id },
      { expiresIn: '1h' }
    );

    res.cookie('registerToken', registerToken, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      domain: process.env.COOKIE_DOMAIN,
    });

    res.redirect(`${process.env.ORIGIN}/auth/register`);
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
