import { Router } from 'express';
import { socialRedirect, googleCallback } from '../../controllers/auth/google';
import { register } from '../../controllers/auth/register';
import { getAuthInfo } from '../../controllers/auth/getAuthInfo';
import { logout } from '../../controllers/auth/logout';
import userMiddleware from '../../middlewares/user';
import { refresh } from '../../controllers/auth/refresh';
import { experience } from '../../controllers/auth/experience';

const router = Router();

router.get('/', userMiddleware, getAuthInfo);
router.post('/refresh', refresh);

router.post('/register', register);
router.post('/logout', logout);
router.post('/experience', experience);

router.get('/redirect/:provider', socialRedirect);

router.get('/callback/google', googleCallback);

export default router;
