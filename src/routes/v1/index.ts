import { Router } from 'express';
import auth from './auth';
import portfolio from './portfolio';
import metadata from './metadata';

const router = Router();

router.use('/auth', auth);
router.use('/portfolio', portfolio);
router.use('/metadata', metadata);

export default router;
