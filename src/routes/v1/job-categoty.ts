import { Router } from 'express';
import { listJobCategory } from '../../controllers/jobCategory/list';
import { editJobCategory } from '../../controllers/jobCategory/edit';
import userMiddleware from '../../middlewares/user';

const router = Router();

router.get('/list', listJobCategory);
router.put('/', userMiddleware, editJobCategory);

export default router;
