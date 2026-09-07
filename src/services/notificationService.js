import { campusStore } from './campusStore';

export const notificationService = {
  async getNotifications(userId) {
    return campusStore.getUserNotifications(userId);
  },

  async markAsRead(notificationId) {
    return campusStore.markNotificationRead(notificationId);
  },

  async markAllRead(userId) {
    return campusStore.markAllNotificationsRead(userId);
  }
};
