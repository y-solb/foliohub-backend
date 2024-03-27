import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../../controllers/image/upload';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload/:type', upload.single('file'), uploadImage);

export default router;
