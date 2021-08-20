import { ToastOptions } from "../components/opc-toast/types";
import Keycloak from "keycloak-js";

export type Config = {
  apiBasePath: string;
  subscriptionsPath: string;
} & Keycloak.KeycloakConfig;

export type Notification = {
  id?: string;
  subject?: string;
  body?: string;
  sentOn?: string;
  link?: string;
  app?: string;
  variant?: ToastOptions["variant"];
};
