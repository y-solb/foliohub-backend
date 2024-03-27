/**
 *  이미지 URL에서 cloudinary 기본 URL을 제거하여 이미지 상대 경로 반환
 * @param url 이미지 URL
 * @returns cloudinary 기본 URL을 제거한 이미지 상대 경로
 */
export function extractImagePath(url: string) {
  const cloudinaryBaseUrl = process.env.CLOUDINARY_BASE_URL;
  if (!cloudinaryBaseUrl) {
    throw new Error('CLOUDINARY_BASE_URL environment variable is not defined.');
  }

  return url.replace(cloudinaryBaseUrl, '');
}

/**
 * Cloudinary 기본 URL에 상대 경로를 추가하여 완전한 이미지 URL 반환
 * @param path Cloudinary URL에 추가할 상대 경로
 * @returns Cloudinary 기본 URL과 합친 완전한 이미지 URL
 */
export function prependCloudinaryBaseUrl(path: string) {
  const cloudinaryBaseUrl = process.env.CLOUDINARY_BASE_URL;
  if (!cloudinaryBaseUrl) {
    throw new Error('CLOUDINARY_BASE_URL environment variable is not defined.');
  }

  return `${cloudinaryBaseUrl}${path}`;
}
