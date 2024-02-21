import { extractUrlMetadata } from './../../controllers/metadata/index';
import { Router } from 'express';

const router = Router();

router.get('/', extractUrlMetadata);

export default router;
