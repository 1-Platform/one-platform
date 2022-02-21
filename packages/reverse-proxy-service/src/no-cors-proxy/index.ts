import { Router } from 'express';
import resolver from './resolver';

const router = Router();
// /api/no-cors-proxy/< url to be proxied >
router.use( '/:url(*)', resolver);

export default router;
