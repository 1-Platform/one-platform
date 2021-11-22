import { CreateFeedbackVariable, FeedbackReturn } from "../gql/types";
import { OpKeycloakAuthProvider } from "../keycloakAuthProvider/keycloakAuthProvider";
import { ToastOptions } from "../components/opc-toast/types";
import { Notification } from "../opc-provider/types";
import { Client, RequestPolicy } from "@urql/core";

export type KeycloakConfig = {
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
};

export type Config = {
  apiBasePath: string;
  subscriptionsPath: string;
  cachePolicy?: RequestPolicy;
  isDebugMode?: boolean;
} & KeycloakConfig;

export type Feedback = {
  sendFeedback: (feedback: CreateFeedbackVariable["input"]) => FeedbackReturn;
};

export type Toast = {
  showToast: (notification: Notification, options?: ToastOptions) => void;
} & Record<
  ToastOptions["variant"],
  (notification: Notification, options?: ToastOptions) => void
>;

export type OpcBase = {
  config?: Config;
  auth?: OpKeycloakAuthProvider;
  toast?: Toast;
  feedback?: Feedback;
  api?: Client;
};
