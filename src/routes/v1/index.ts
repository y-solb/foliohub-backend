import { Router } from 'express';
import auth from './auth';
import portfolio from './portfolio';
import metadata from './metadata';
import user from './user';
import jobCategory from './job-categoty';

const router = Router();

router.use('/auth', auth);
router.use('/portfolio', portfolio);
router.use('/metadata', metadata);
router.use('/user', user);
router.use('/job-category', jobCategory);

export default router;
