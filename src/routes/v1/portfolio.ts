import { Router } from 'express';
import { editPortFolio } from '../../controllers/portfolio/edit';
import userMiddleware from '../../middlewares/user';
import { getPortFolio } from '../../controllers/portfolio/get';
import { listPortFolio } from '../../controllers/portfolio/list';
import { likePortfolio, unlikePortfolio } from '../../controllers/like/likePortfolio';
import { listLike } from '../../controllers/like/list';

const router = Router();

router.get('/list', listPortFolio);
router.get('/:userId', userMiddleware, getPortFolio);
router.put('/:userId', userMiddleware, editPortFolio);

router.get('/like/list', userMiddleware, listLike);
router.post('/like/:portfolioId', userMiddleware, likePortfolio);
router.post('/unlike/:portfolioId', userMiddleware, unlikePortfolio);

export default router;
