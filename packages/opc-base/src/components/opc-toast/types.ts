export type Notification = {
  subject?: string;
  body?: string;
  sentOn?: string;
  link?: string;
};

export type ToastOptions = {
  addToDrawer?: boolean;
  duration?: string;
  variant: "success" | "warn" | "danger" | "info" | "muted";
};
