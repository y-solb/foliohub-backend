import { NextFunction, Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { CustomError } from '../../libs/customError';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const IMAGETYPES = ['thumbnail', 'asset'];

/**
 * 이미지 업로드
 * POST /v1/image/upload/:type'
 */
export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  const { type } = req.params;
  if (!IMAGETYPES.includes(type)) {
    return next(new CustomError(400, 'General', `해당 ${type} type은 존재하지 않습니다.`));
  }
  try {
    if (!req.file) {
      return next(new CustomError(400, 'Validation', '업로드 할 파일이 존재하지 않습니다.'));
    }
    const file = req.file.path;

    const result: UploadApiResponse = await cloudinary.uploader.upload(file, {
      resource_type: 'image',
      folder: type,
      width: 1000,
      crop: 'scale',
    });

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error(err);
      }
      res.json({
        imageUrl: `${process.env.CLOUDINARY_BASE_URL}/${result.public_id}.${result.format}`,
      });
    });
  } catch (error) {
    return next(new CustomError(400, 'Raw', 'Error', null, error));
  }
};
