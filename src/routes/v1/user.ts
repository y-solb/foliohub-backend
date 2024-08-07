import { Router } from 'express';
import userMiddleware from '../../middlewares/user';
import { my } from '../../controllers/user/my';
import { deleteAccount } from '../../controllers/user/account';
import { editJobCategory } from '../../controllers/user/edit';

const router = Router();

router.get('/my', userMiddleware, my);
router.put('/job-category', userMiddleware, editJobCategory);
router.delete('/account', userMiddleware, deleteAccount);

export default router;
