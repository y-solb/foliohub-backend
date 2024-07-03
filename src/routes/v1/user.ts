import { Router } from 'express';
import userMiddleware from '../../middlewares/user';
import { my } from '../../controllers/user/my';
import { deleteAccount } from '../../controllers/user/account';

const router = Router();

router.get('/my', userMiddleware, my);
router.delete('/account', userMiddleware, deleteAccount);

export default router;
