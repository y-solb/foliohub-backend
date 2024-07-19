import { Router } from 'express';
import v1 from './v1/';

const router = Router();

router.get('/', (_, res) => res.send("it's running 🚀🚀"));
router.use('/v1', v1);

export default router;
