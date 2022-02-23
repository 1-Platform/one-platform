import { Router } from 'express';
import resolver from './resolver';

const router = Router();
router.all( '*', resolver);

export default router;
