import jwt, { SignOptions } from 'jsonwebtoken';
import { Response } from 'express';

export const generateToken = (payload: string | Buffer | object, options?: SignOptions) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
};

export const decodeToken = (token: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export function setTokenCookie(
  res: Response,
  tokens: { accessToken: string; refreshToken: string }
) {
  const { accessToken, refreshToken } = tokens;

  res.cookie('accessToken', accessToken, {
    path: '/',
    maxAge: 1000 * 60 * 60, // 1시간
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    domain: process.env.DOMAIN,
  });

  res.cookie('refreshToken', refreshToken, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    domain: process.env.DOMAIN,
  });
}

export function setAccessTokenCookie(res: Response, accessToken: string) {
  res.cookie('accessToken', accessToken, {
    path: '/',
    maxAge: 1000 * 60 * 60, // 1시간
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    domain: process.env.DOMAIN,
  });
}
