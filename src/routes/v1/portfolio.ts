import { Router } from 'express';
import { editPortFolio } from '../../controllers/portfolio/edit';
import userMiddleware from '../../middlewares/user';
import { getPortFolio } from '../../controllers/portfolio/get';

const router = Router();

router.get('/:userId', getPortFolio);
router.put('/:userId', userMiddleware, editPortFolio);

export default router;
