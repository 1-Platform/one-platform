import { Router } from 'express';
import resolver from './resolver';

const router = Router();

router.get( '/rhel-developer-guide', ( req, res ) => {
  res.redirect( '/rhel-development-guide', 301 );
} );
router.get( '/rhel-development-guide', resolver);
router.get( '*', resolver );

export default router;
