import { Router } from 'express';
import checkSSO from '../middleware/checkSSO';
import resolver from './resolver';

const router = Router();

/* RHEL Development Guide permanent redirect */
router.get('/rhel-developer-guide', (req, res) => {
  res.redirect('/rhel-development-guide', 301);
});
/* Proxy all other apps using resolver */
router.get('*', [checkSSO], resolver);

export default router;
