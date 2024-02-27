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

export function setTokenCookie(res: Response, refreshToken: string) {
  // const { accessToken, refreshToken } = tokens;

  // res.cookie("accessToken", accessToken, {
  //   // maxAge: 1000 * 60 * 60,
  //   maxAge: 60 * 1000,
  //   httpOnly: true,
  // });

  res.cookie('refreshToken', refreshToken, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 14,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });
}
