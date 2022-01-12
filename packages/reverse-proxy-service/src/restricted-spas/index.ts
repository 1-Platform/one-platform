import { Router } from 'express';
import resolver from './resolver';

const router = Router();
router.get( '/rhel-developer-guide', resolver );

export default router;
