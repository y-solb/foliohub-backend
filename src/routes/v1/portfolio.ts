import { Router } from 'express';
import { editPortFolio } from '../../controllers/portfolio/edit';
import userMiddleware from '../../middlewares/user';
import { getPortFolio } from '../../controllers/portfolio/get';
import { listPortFolio } from '../../controllers/portfolio/list';
import { likePortfolio, unlikePortfolio } from '../../controllers/like/likePortfolio';
import { listLike } from '../../controllers/like/list';
import { metadataPortfolio } from '../../controllers/portfolio/metadata';

const router = Router();

router.get('/list', listPortFolio);

router.get('/:username', userMiddleware, getPortFolio);
router.put('/:username', userMiddleware, editPortFolio);
router.get('/metadata/:username', metadataPortfolio);

router.get('/like/list', userMiddleware, listLike);
router.post('/like/:portfolioId', userMiddleware, likePortfolio);
router.post('/unlike/:portfolioId', userMiddleware, unlikePortfolio);

export default router;
