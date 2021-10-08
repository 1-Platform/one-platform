import { Notification } from "./types";

export const getNotificationAppCount = (
  notifications: Notification[]
): Record<string, number> => {
  return notifications.reduce<Record<string, number>>((prev, current) => {
    if (current?.app) {
      prev[current.app] = (prev?.[current.app] || 0) + 1;
    } else {
      prev.others = (prev?.others || 0) + 1;
    }
    return prev;
  }, {});
};
