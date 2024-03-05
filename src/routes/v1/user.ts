import { Router } from 'express';
import userMiddleware from '../../middlewares/user';
import { my } from '../../controllers/user/my';

const router = Router();

router.get('/my', userMiddleware, my);

export default router;
