import { Router } from 'express';
import resolver from './resolver';

const router = Router();

router.get( '/rhel-developer-guide', resolver );
router.get( '/rhel-development-guide', resolver);
router.get( '*', resolver );

export default router;
