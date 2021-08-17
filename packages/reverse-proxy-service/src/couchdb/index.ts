import { Router } from 'express';
import resolver from './resolver';

const router = Router();
router.use( '*', resolver);

export default router;
