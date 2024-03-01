import { Router } from 'express';
import { editPortFolio } from '../../controllers/portfolio/edit';
import userMiddleware from '../../middlewares/user';
import { getPortFolio } from '../../controllers/portfolio/get';
import { listPortFolio } from '../../controllers/portfolio/list';

const router = Router();

router.get('/list', listPortFolio);
router.get('/:userId', getPortFolio);
router.put('/:userId', userMiddleware, editPortFolio);

export default router;
