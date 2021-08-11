import { ToastOptions } from "./components/opc-toast/types";
import { Notification } from "./opc-provider/types";
import { OpKeycloakAuthProvider } from "./keycloakAuthProvider/keycloakAuthProvider";

declare global {
  interface Window {
    OpAuthHelper: OpKeycloakAuthProvider;
    OpNotification: {
      showToast: (notification: Notification, options?: ToastOptions) => void;
    } & Record<
      ToastOptions["variant"],
      (notification: Notification, options?: ToastOptions) => void
    >;
    sendFeedback: (feedbackInput: any) => any;
  }
}
