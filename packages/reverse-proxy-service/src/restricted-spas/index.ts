import { Router } from 'express';
import { rhelDeveloperGuide } from './resolver';
import keycloak from '../utils/keycloakAuth';

const router = Router();
router.all( '/rhel-developer-guide', keycloak.protect(), rhelDeveloperGuide );

export default router;
