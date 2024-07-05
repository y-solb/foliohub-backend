import { Router } from 'express';
import { listJobCategory } from '../../controllers/jobCategory/list';

const router = Router();

router.get('/list', listJobCategory);

export default router;
