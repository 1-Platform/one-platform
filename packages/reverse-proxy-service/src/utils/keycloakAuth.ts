import Keycloak from 'keycloak-connect';
import { MemoryStore } from 'express-session';
import { KEYCLOAK_CLIENT_ID, KEYCLOAK_PUBKEY, KEYCLOAK_REALM, KEYCLOAK_SERVER_URL } from '../config/env';

export const memoryStore = new MemoryStore();

const keycloakConfig: any = {
  realm: KEYCLOAK_REALM,
  realmPublicKey: KEYCLOAK_PUBKEY,
  authServerUrl: KEYCLOAK_SERVER_URL,
  resource: KEYCLOAK_CLIENT_ID,
  publicClient: true,
  sslRequired: 'external'
};

const keycloak = new Keycloak( { store: memoryStore }, keycloakConfig );
export default keycloak;
