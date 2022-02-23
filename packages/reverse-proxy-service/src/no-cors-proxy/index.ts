import { Router } from 'express';
import resolver from './resolver';

const router = Router();
// /api/no-cors-proxy/< url to be proxied >
router.all( '/:url(*)', resolver);

export default router;
